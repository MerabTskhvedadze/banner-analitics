import {
  MdDone,
  MdInfo,
  MdCircle,
  MdVerified,
  MdLightbulb,
  MdAutoGraph,
  MdPsychology,
  MdCheckCircle,
  MdCloudUpload,
  MdArrowForward,
} from "react-icons/md";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* <!-- Navigation --> */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-icons text-white">analytics</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">BannerScore<span className="text-primary">AI</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#preview">Example Report</a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</a>
              <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* <!-- Hero Section --> */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 data-animate="hero-title" className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
              Stop Guessing, <br /><span className="text-primary">Start Scoring.</span>
            </h1>
            <p data-animate="hero-desc" className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0">
              Use AI to analyze your banner designs before you go live. Increase CTR and engagement with data-driven feedback in seconds.
            </p>
            <div data-animate="hero-cta" className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
                Try it Now <MdArrowForward />
              </button>
            </div>
          </div>
          <div data-animate="hero-image" className="flex-1 relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
              <img className="rounded-xl w-full" data-alt="Modern abstract digital banner design graphic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeQnYoKOaua5oGYq8agSQ0C_f1TqSao94ZSNe6LSZIZLI9vHZSk74aw0ynk7A1poHNXwBEYy_ldaD5qodAV-zDZLGXn_u_pOgqKEBP4myn_T1KGOMMO8OMF9a6287iJ5J_q6e3u3Cln9fskXp0-e35926I27McncyIiNvQT4uHuhM9goPoGsfVdmXAjyxyfq86SAYN_SjzBUd2o6a-5AmopRbS9hZpqrNedBAg2Bs4rsnVFXgmncKaOyAd_C_sL2JJOtZjfq-aiAw2" />
              <div className="absolute -right-8 top-1/4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-primary/20 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent flex items-center justify-center">
                    <span className="font-bold text-primary">85</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Score</p>
                    <p className="text-sm font-bold text-green-500">Optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- How it Works --> */}
      <section className="py-24 bg-white dark:bg-slate-900/50" id="how-it-works">
        <div data-animate="section-header" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How it Works</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Get professional design feedback in three simple steps. No design degree required.</p>
        </div>
        <div data-animate="steps-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {/* <!-- Step 1 --> */}
          <div data-animate="step-card" className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <MdCloudUpload className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">1. Upload</h3>
            <p className="text-slate-500 leading-relaxed">Simply drag and drop your social media banner, web header, or ad creative in JPG or PNG format.</p>
          </div>
          {/* <!-- Step 2 --> */}
          <div data-animate="step-card" className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <MdPsychology className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">2. Analyze</h3>
            <p className="text-slate-500 leading-relaxed">Our AI scans for visual hierarchy, typography contrast, color harmony, and readability across all devices.</p>
          </div>
          {/* <!-- Step 3 --> */}
          <div data-animate="step-card" className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <MdAutoGraph className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">3. Improve</h3>
            <p className="text-slate-500 leading-relaxed">Receive a detailed score and actionable design tips to optimize your banner for maximum conversions.</p>
          </div>
        </div>
      </section>

      {/* <!-- Example Report Preview --> */}
      <section className="py-24 overflow-hidden" id="preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="report" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/3 p-8 border-r border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Banner Analysis Report</h4>
                    <p className="text-sm text-slate-500">Analysis completed in 1.4 seconds</p>
                  </div>
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold flex items-center gap-2">
                    <MdVerified /> Verified Design
                  </div>
                </div>
                <img className="w-full h-80 object-cover rounded-xl mb-8" data-alt="Abstract colorful marketing banner illustration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD70ghMZghlnSBJAGQJuMbUMbFGVG619AIh9J3uoNFf0VKDstIS44pzOixIQGa_haCxK5hFrGQsNuR9CvIN4TpwrIJQkxmUwLDGeMwb7kSTLdB2tFlqwYxI_fL7jdU1Nn4-S69Pg6EovbhYllDYUkI8YPkg-Kqh2MUMaqvxafqjN29WurXo8pY-3mMJq8n46JKfEo4oYBw1FrSBVyvtbRaRtxFSvgXKTcGLhGgw_5DxCXfqzE1C78UgFYLkBJzaiTyR6F_kzNlYntkg" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div data-animate="stat-box" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs font-bold text-slate-400 uppercase">Contrast</p>
                    <p className="text-xl font-bold text-primary">High</p>
                  </div>
                  <div data-animate="stat-box" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs font-bold text-slate-400 uppercase">Hierarchy</p>
                    <p className="text-xl font-bold text-primary">Clear</p>
                  </div>
                  <div data-animate="stat-box" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs font-bold text-slate-400 uppercase">Text Legibility</p>
                    <p className="text-xl font-bold text-primary">94%</p>
                  </div>
                  <div data-animate="stat-box" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs font-bold text-slate-400 uppercase">Mobile Fit</p>
                    <p className="text-xl font-bold text-primary">Perfect</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 bg-slate-50 dark:bg-slate-800/20 p-8">
                <div className="text-center mb-10">
                  <div className="relative inline-block">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle className="text-slate-200 dark:text-slate-800" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                      <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="54.6" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">85</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-500 mt-4 uppercase">Overall Design Score</p>
                </div>
                <div className="space-y-6">
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MdLightbulb className="text-primary text-lg" /> AI Recommendations
                  </h5>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <MdCheckCircle className="text-green-500 text-lg" />
                      <span>Background color matches text accessibility standards.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <MdInfo className="text-green-500 text-xl" />
                      <span>Increase Call-To-Action font size by 2px for better visibility.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <MdCheckCircle className="text-green-500 text-lg" />
                      <span>Visual balance is centered and professional.</span>
                    </li>
                  </ul>
                  <button className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 mt-4">Download Full PDF Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Pricing Section --> */}
      <section className="py-24 bg-primary/5" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="section-header" className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Simple, Credit-Based Pricing</h2>
            <p className="text-slate-500">Only pay for what you analyze. No monthly subscriptions required.</p>
          </div>
          <div data-animate="pricing-grid" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* <!-- Starter --> */}
            <div data-animate="pricing-card" className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$29</span>
                <span className="text-slate-400 text-sm">/ 10 Credits</span>
              </div>
              <ul className="space-y-4 mb-10 grow">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> AI Design Scoring
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Basic Recommendations
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Web App Access
                </li>
              </ul>
              <button className="w-full py-3 border border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors">Get Tokens</button>
            </div>
            {/* <!-- Pro --> */}
            <div data-animate="pricing-card" className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-primary shadow-2xl relative flex flex-col h-full scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
              <h3 className="text-lg font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$99</span>
                <span className="text-slate-400 text-sm">/ 50 Credits</span>
              </div>
              <ul className="space-y-4 mb-10 grow">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Advanced Analysis
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Sentiment &amp; Heatmaps
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> PDF Export Reports
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Priority Support
                </li>
              </ul>
              <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30">Get Tokens</button>
            </div>
            {/* <!-- Enterprise --> */}
            <div data-animate="pricing-card" className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-10 grow">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Unlimited Credits
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> API Access
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MdDone className="text-primary text-lg" /> Custom AI Models
                </li>
              </ul>
              <button className="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Final CTA --> */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="final-cta" className="bg-primary rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">Ready to optimize your designs?</h2>
            <p className="text-primary-100 text-xl mb-10 max-w-2xl mx-auto opacity-90 relative z-10 text-white/80">Join thousands of marketers who are saving time and money with BannerScore AI.</p>
            <button className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl">Get Started for Free</button>
          </div>
        </div>
      </section>

      {/* <!-- Footer --> */}
      <footer data-animate="footer" className="bg-white dark:bg-background-dark py-16 border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2026 BannerScore AI Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MdCircle className="text-green-500 text-sm" /> Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
