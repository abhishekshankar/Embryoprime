import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import Layout from '../components/Layout';
import RecentAnalyses from '../components/RecentAnalyses';
import UploadForm from '../components/UploadForm';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      setUser(session.user);
      await fetchRecentAnalyses(session.user.id);
      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const fetchRecentAnalyses = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      setRecentAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard | Embryoprime</title>
      </Head>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                New Analysis
              </h2>
              <UploadForm onUploadComplete={() => fetchRecentAnalyses(user.id)} />
            </div>
          </div>
          
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Recent Analyses
              </h2>
              <RecentAnalyses analyses={recentAnalyses} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
