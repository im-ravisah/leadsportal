import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { type Role } from "../../constants/roles";

interface NotFoundProps {
  role?: Role;
  basePath?: string;
}

export function NotFound({ role, basePath = "/" }: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <h1 className="text-9xl font-bold text-slate-300 dark:text-slate-700">404</h1>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button
          onClick={() => navigate(`${basePath}/dashboard`)}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
