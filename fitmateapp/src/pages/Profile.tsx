import { useEffect, useState } from "react";
import {
  UserProfileService,
  type UserProfileDto,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "../api-generated";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editForm, setEditForm] = useState<UpdateProfileRequest>({
    userName: "",
  });

  const [passForm, setPassForm] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await UserProfileService.getApiUserprofile();
      setProfile(data);
      setEditForm({
        userName: data.userName || "",
        fullName: data.fullName || "",
        email: data.email || "",
      });
    } catch (e) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await UserProfileService.putApiUserprofile({
        requestBody: editForm,
      });
      setProfile(updated);
      toast.success("Profile updated!");
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await UserProfileService.postApiUserprofileChangePassword({
        requestBody: passForm,
      });
      toast.success("Password changed successfully!");
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      toast.error("Failed to change password");
    }
  };

  if (isLoading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            Edit Details
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400">Username</label>
              <input
                type="text"
                value={editForm.userName}
                onChange={(e) =>
                  setEditForm({ ...editForm, userName: e.target.value })
                }
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Full Name</label>
              <input
                type="text"
                value={editForm.fullName || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Email</label>
              <input
                type="email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
            >
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400">
                Current Password
              </label>
              <input
                type="password"
                value={passForm.currentPassword}
                onChange={(e) =>
                  setPassForm({ ...passForm, currentPassword: e.target.value })
                }
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">
                New Password
              </label>
              <input
                type="password"
                value={passForm.newPassword}
                onChange={(e) =>
                  setPassForm({ ...passForm, newPassword: e.target.value })
                }
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passForm.confirmPassword}
                onChange={(e) =>
                  setPassForm({ ...passForm, confirmPassword: e.target.value })
                }
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
              />
            </div>
            <button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded w-full"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
