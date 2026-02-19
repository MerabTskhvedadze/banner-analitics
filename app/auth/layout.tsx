import Typography from "@/components/Typography";
import { FaStar } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-stretch">
      <aside className="hidden lg:flex w-[45%] relative overflow-hidden bg-[#137FEC] items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <MdLeaderboard className="text-primary text-2xl" />
              </div>

              <Typography variant="h7" color="inherit" className="tracking-tight">
                BannerScore AI
              </Typography>
            </div>

            <Typography as="h1" variant="h2" color="inherit" className="leading-tight mb-4">
              Elevate your visual strategy with AI.
            </Typography>

            <Typography variant="h7" color="inherit" className="font-medium text-blue-100/80">
              Join 5,000+ professionals using BannerScore to optimize their ad creative and boost conversions.
            </Typography>
          </div>

          <div className="glass-card rounded-xl p-8 text-white shadow-2xl">
            <div className="flex gap-1 mb-4">
              <FaStar className="text-yellow-400 text-sm" />
              <FaStar className="text-yellow-400 text-sm" />
              <FaStar className="text-yellow-400 text-sm" />
              <FaStar className="text-yellow-400 text-sm" />
              <FaStar className="text-yellow-400 text-sm" />
            </div>

            <Typography variant="h8" color="inherit" italic className="mb-6 leading-relaxed">
              "BannerScore AI cut our design iteration time by 70%. It's a game changer for our marketing team."
            </Typography>

            <div className="flex items-center gap-4">
              <img
                alt="Sarah J."
                className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV1qCqaOY4fChlz-rHVgRoADN14rulqI04nDMMEk9yGcVgovoKxLAdFbMdH3Gw1nv8P7ZtKdeGEuuV7-yhHHACNQJjyZpjcYdtiYv1EaF4kEOTaX-nuaN1jNxzdZv4-YMWaiAfwj1_9jFT2Y7edtcAR8VjUFKw0cUBCaKgcxhPQbGJn4AcSQck5AV6btwLlExGZg3g7h6NHV41MwtEQ7ISH7L40lhkF_kD9A55VNv30Hw57i9v3KgokLEb70ksocDyaJeAxxqXnZcv"
              />
              <div>
                <Typography variant="body" color="inherit" className="font-semibold">
                  Sarah J.
                </Typography>
                <Typography variant="caption" color="inherit" className="text-blue-100/70">
                  Creative Director at DesignFlow
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white dark:bg-background-dark">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </main>
  );
}