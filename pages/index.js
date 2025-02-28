import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };
    
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head>
        <title>Embryoprime | Advanced Embryo Analysis</title>
        <meta name="description" content="Advanced embryo analysis platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold text-blue-600">
            Loading Embryoprime...
          </h1>
        </div>
      </div>
    </div>
  );
}
