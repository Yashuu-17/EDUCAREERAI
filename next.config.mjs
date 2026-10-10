/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Roadmap singular & variants
      {
        source: '/roadmap',
        destination: '/roadmaps',
        permanent: false,
      },
      {
        source: '/roadmap/:slug',
        destination: '/roadmaps/:slug',
        permanent: false,
      },

      // Interview & Quizzes variants
      {
        source: '/interview',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/interviews',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/interview-quiz',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/interview-quizzes',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/interview-prep',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/interview-questions',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/quiz',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/quizze',
        destination: '/quizzes',
        permanent: false,
      },
      {
        source: '/quizz',
        destination: '/quizzes',
        permanent: false,
      },

      // Resume Tools variants
      {
        source: '/resume',
        destination: '/resume-tools',
        permanent: false,
      },
      {
        source: '/resumes',
        destination: '/resume-tools',
        permanent: false,
      },
      {
        source: '/resume-tool',
        destination: '/resume-tools',
        permanent: false,
      },
      {
        source: '/resume-builder',
        destination: '/resume-maker',
        permanent: false,
      },
      {
        source: '/resume-analyzer',
        destination: '/resume-analyser',
        permanent: false,
      },
      {
        source: '/resume-analysis',
        destination: '/resume-analyser',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
