import Link from 'next/link'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <div className="container mx-auto px-4 py-16">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">
                        Next.js SaaS Starter Kit
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Supabaseを活用した最新のSaaSスターターキット
                    </p>
                    <Link
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        今すぐ始める
                    </Link>
                </header>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">認証機能</h3>
                        <p className="text-gray-300">
                            Supabaseによる堅牢な認証システムを実装済み
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">TypeScript対応</h3>
                        <p className="text-gray-300">
                            型安全な開発環境で生産性を向上
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">モダンなUI</h3>
                        <p className="text-gray-300">
                            TailwindCSSによる美しいデザイン
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
} 