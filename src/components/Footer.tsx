export default function Footer() {
  return (
    <footer className="w-full bg-foreground text-primary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">
              MedFlow
            </h3>
            <p className="font-paragraph text-sm text-primary-foreground/80">
              Hospital Patient Workflow Coordination System
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">
              Departments
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="font-paragraph text-sm text-primary-foreground/80">
                  Doctor Portal
                </span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-primary-foreground/80">
                  Pharmacy Portal
                </span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-primary-foreground/80">
                  Laboratory Portal
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">
              System
            </h3>
            <p className="font-paragraph text-sm text-primary-foreground/80">
              Real-time coordination for improved patient care
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <p className="font-paragraph text-sm text-primary-foreground/60 text-center">
            © 2026 MedFlow. Hospital Workflow Coordination System.
          </p>
        </div>
      </div>
    </footer>
  );
}
