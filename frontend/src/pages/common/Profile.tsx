import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../contexts/theme/ThemeProvider";
import { getAuthToken } from "../../utils/auth";
import { ROLES, type Role } from "../../constants/roles";
import { cn } from "../../lib/cn";

interface ProfileProps {
  role: Role;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roleId?: string | number;
  department?: string;
  createdAt?: string;
  lastLogin?: string;
  avatar?: string;
}

export function Profile({ role }: ProfileProps) {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role,
    roleId: "",
    department: "",
    createdAt: "",
    lastLogin: "",
    avatar: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = getAuthToken(role);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setProfile(prev => ({
          ...prev,
          firstName: payload.first_name || "",
          lastName: payload.last_name || "",
          email: payload.email || "",
          phone: payload.phone || "",
          role: payload.role || role,
          roleId: (payload.role_id ?? payload.role_id_fk ?? payload.role_id) || "",
          department: payload.department || payload.department_name || "",
          createdAt: payload.created_at || payload.date_joined || "",
          lastLogin: payload.last_login || "",
          avatar: payload.avatar
        }));
      } catch {
        // ignore decode errors, keep defaults
      }
    }
  }, [role]);

  const handleChange = (field: keyof Pick<ProfileData, "firstName" | "lastName" | "email" | "phone">, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // TODO: send updated profile to API
    setIsEditing(false);
  };

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}` || "U";

  const handleVerifyPassword = () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword) {
      setPasswordError("Please enter your current password to verify.");
      return;
    }

    // TODO: call verify-password API with email and oldPassword
    console.log("Verify current password payload", {
      email: profile.email,
      oldPassword
    });
    setPasswordVerified(true);
    setPasswordSuccess("Password verified. You can now set a new password.");
  };

  const handlePasswordUpdate = () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordVerified) {
      setPasswordError("Please verify your current password first.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setPasswordError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    // TODO: call change-password API with email, oldPassword, newPassword
    console.log("Change password payload", {
      email: profile.email,
      oldPassword,
      newPassword
    });
    setPasswordSuccess("Password updated successfully (API integration pending).");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and update your account details. Only basic contact information is editable.
          </p>
        </div>
        <div className="flex items-center ml-auto">
          <button
            type="button"
            onClick={() => setIsEditing(prev => !prev)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-colors shadow-xs",
              isEditing
                ? "bg-slate-100 dark:bg-[#1a1c22] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#282a34] hover:bg-slate-200 dark:hover:bg-[#22252f]"
                : "bg-orange-500 hover:bg-orange-600 text-white border-orange-500 dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 dark:border-slate-200"
            )}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Main profile card */}
      <div className="bg-white dark:bg-[#111215] rounded-xl border border-slate-200/90 dark:border-[#1e2026] p-6 flex flex-col lg:flex-row gap-8 shadow-xs">
        <div className="flex flex-col items-center lg:items-start gap-4 w-full max-w-xs lg:pl-16">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-[#282b36]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-500 dark:bg-[#181a20] text-white dark:text-slate-200 border border-orange-400 dark:border-[#282b36] flex items-center justify-center text-xl font-semibold shadow-xs">
                {initials}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white dark:bg-[#181a20] border border-slate-200 dark:border-[#282b36] text-xs text-orange-500 dark:text-slate-300 flex items-center justify-center cursor-pointer shadow-xs">
                ✎
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
          <div className="text-center lg:text-center">
            <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f5f9]">
              {profile.firstName || profile.lastName
                ? `${profile.firstName} ${profile.lastName}`.trim()
                : "User"}
            </p>
            <div className="mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#181a20] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#23252e] capitalize">
                {profile.role || role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Editable fields */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 disabled:bg-slate-50/80 dark:disabled:bg-[#14161c] disabled:text-slate-500 dark:disabled:text-[#9fa4b0] disabled:border-slate-200 dark:disabled:border-[#1e2026] transition-colors shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-[#9fa4b0] mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 disabled:bg-slate-50/80 dark:disabled:bg-[#14161c] disabled:text-slate-500 dark:disabled:text-[#9fa4b0] disabled:border-slate-200 dark:disabled:border-[#1e2026] transition-colors shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-[#9fa4b0] mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 disabled:bg-slate-50/80 dark:disabled:bg-[#14161c] disabled:text-slate-500 dark:disabled:text-[#9fa4b0] disabled:border-slate-200 dark:disabled:border-[#1e2026] transition-colors shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-[#9fa4b0] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 disabled:bg-slate-50/80 dark:disabled:bg-[#14161c] disabled:text-slate-500 dark:disabled:text-[#9fa4b0] disabled:border-slate-200 dark:disabled:border-[#1e2026] transition-colors shadow-xs"
            />
          </div>

          {/* Readonly metadata */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-dashed border-slate-200 dark:border-[#1e2026] mt-3">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-[#9fa4b0]">
                Role
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-[#f1f5f9] mt-0.5">
                {profile.role || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-[#9fa4b0]">
                Department
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-[#f1f5f9] mt-0.5">
                {profile.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-[#9fa4b0]">
                Created At
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-[#f1f5f9] mt-0.5">
                {profile.createdAt || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-[#9fa4b0]">
                Last Login
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-[#f1f5f9] mt-0.5">
                {profile.lastLogin || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 text-sm font-medium transition-colors shadow-xs"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Change password card */}
      {/* Change password card */}
      <div className="bg-white dark:bg-[#111215] rounded-xl border border-slate-200/90 dark:border-[#1e2026] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-[#f1f5f9]">
              Security
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9fa4b0]">
              Update your password. Your email is used to identify your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordPanel(prev => !prev)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200/90 dark:border-[#23252e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#181a20] transition-colors shadow-xs"
          >
            {showPasswordPanel ? "Hide" : "Change Password"}
          </button>
        </div>

        {showPasswordPanel && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
          >
            <div className="md:col-span-2">
              <p className="text-[11px] font-medium text-slate-500 dark:text-[#9fa4b0]">
                Email
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-[#f1f5f9] mt-0.5">
                {profile.email || "N/A"}
              </p>
            </div>
            {!passwordVerified && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-[#9fa4b0] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 pr-9 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 transition-colors shadow-xs"
                  />
                  {oldPassword && (
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(prev => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label={showOldPassword ? "Hide password" : "Show password"}
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="md:col-span-2 flex items-center justify-between mt-2">
              <div className="space-y-1">
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-xs text-emerald-500">{passwordSuccess}</p>
                )}
              </div>
              {!passwordVerified && (
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 text-sm font-medium transition-colors shadow-xs"
                >
                  Verify
                </button>
              )}
            </div>

            {passwordVerified && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-[#9fa4b0] mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 pr-9 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 transition-colors shadow-xs"
                    />
                    {newPassword && (
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(prev => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-[#9fa4b0] mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200/90 dark:border-[#23252e] bg-white dark:bg-[#0c0d10] px-3.5 py-2 pr-9 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 transition-colors shadow-xs"
                    />
                    {confirmPassword && (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center justify-end mt-2">
                  <button
                    type="button"
                    onClick={handlePasswordUpdate}
                    className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 text-sm font-medium transition-colors shadow-xs"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

