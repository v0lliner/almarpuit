import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Settings, 
  Phone,
  Loader2,
  Languages,
  Image,
  ArrowRight
} from 'lucide-react';

interface ActivityItem {
  id: string;
  section_key: string;
  action_type: 'created' | 'updated' | 'deleted';
  user_email: string;
  created_at: string;
}

interface ContentWarning {
  type: 'missing_translation' | 'missing_image';
  section: string;
  field: string;
  language?: 'et' | 'en';
}

export default function DashboardSection() {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [contentWarnings, setContentWarnings] = useState<ContentWarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select(`
          id,
          key,
          updated_at,
          translations (id),
          images (id)
        `)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const activity = data.map(item => ({
        id: item.id,
        section_key: item.key,
        action_type: 'updated' as const,
        user_email: 'admin@example.com', // In a real app, you'd get this from audit logs
        created_at: item.updated_at
      }));

      setRecentActivity(activity);
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError('Failed to load recent activity');
    }
  };

  const fetchContentWarnings = async () => {
    try {
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          id,
          key,
          translations (id, key, et, en),
          images (id, key, url)
        `);

      if (sectionsError) throw sectionsError;

      const warnings: ContentWarning[] = [];

      sections.forEach(section => {
        // Check translations
        section.translations.forEach((translation: any) => {
          if (!translation.et) {
            warnings.push({
              type: 'missing_translation',
              section: section.key,
              field: translation.key,
              language: 'et'
            });
          }
          if (!translation.en) {
            warnings.push({
              type: 'missing_translation',
              section: section.key,
              field: translation.key,
              language: 'en'
            });
          }
        });

        // Check required images
        const requiredImages = ['background', 'logo'];
        requiredImages.forEach(imageKey => {
          const hasImage = section.images.some((img: any) => img.key === imageKey && img.url);
          if (!hasImage) {
            warnings.push({
              type: 'missing_image',
              section: section.key,
              field: imageKey
            });
          }
        });
      });

      setContentWarnings(warnings.slice(0, 10));
    } catch (err) {
      console.error('Error fetching content warnings:', err);
      setError('Failed to load content warnings');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchRecentActivity(),
        fetchContentWarnings()
      ]);
      setIsLoading(false);
    };

    fetchData();

    // Set up refresh interval
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-forest-800">Töölaud</h2>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/contact')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <Phone className="h-6 w-6 text-forest-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Kontakt</h3>
            <p className="text-sm text-gray-500">Halda kontaktandmeid</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/settings')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <Settings className="h-6 w-6 text-forest-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Seaded</h3>
            <p className="text-sm text-gray-500">Üldised seaded</p>
          </div>
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <ExternalLink className="h-6 w-6 text-forest-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Vaata veebilehte</h3>
            <p className="text-sm text-gray-500">Ava uues aknas</p>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-forest-600 mr-2" />
            Viimased muudatused
          </h3>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div 
                key={activity.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {activity.section_key}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString('et-EE')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.user_email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Warnings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            Tähelepanu vajavad kohad
          </h3>
          <div className="space-y-4">
            {contentWarnings.map((warning, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-amber-50 rounded-md"
              >
                {warning.type === 'missing_translation' ? (
                  <Languages className="h-5 w-5 text-amber-500 flex-shrink-0" />
                ) : (
                  <Image className="h-5 w-5 text-amber-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {warning.section}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {warning.type === 'missing_translation' 
                      ? `Puudub ${warning.language === 'et' ? 'eestikeelne' : 'ingliskeelne'} tõlge: ${warning.field}`
                      : `Puudub pilt: ${warning.field}`
                    }
                  </p>
                  <button
                    onClick={() => navigate(`/admin/${warning.section}`)}
                    className="text-sm text-forest-600 hover:text-forest-700 mt-2 flex items-center"
                  >
                    <span>Paranda</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}