import { useNavigate } from 'react-router-dom';
import { TreePine, LogOut, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <TreePine className="h-8 w-8 text-forest-700" />
          <h1 className="text-xl font-bold text-forest-800">
            OÜ Almar Puit Haldussüsteem
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 text-forest-600 hover:text-forest-800 transition-colors"
          >
            <span>Mine kodulehele</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Logi välja</span>
          </button>
        </div>
      </div>
    </header>
  );
}