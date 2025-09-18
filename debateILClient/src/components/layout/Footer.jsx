import { brandColors } from "../../data/brandColors";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto py-6 border-t"
      style={{
        background: brandColors.bgLight,
        borderColor: brandColors.primary,
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm" style={{ color: brandColors.text }}>
            © {currentYear} DebateIL. All rights reserved.
          </p>
          <p
            className="text-xs mt-1 opacity-75"
            style={{ color: brandColors.secondary }}
          >
            Where Ideas Collide - Platform for debates and arguments
          </p>
        </div>
      </div>
    </footer>
  );
}
