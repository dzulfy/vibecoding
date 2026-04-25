import React, { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import api from "../services/api";
import { User, Mail, Calendar, Key, User as UserIcon } from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State form update
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/current");
        setProfile(response.data.data);
        setName(response.data.data.name);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setIsUpdating(true);

    try {
      const payload: any = {};
      if (name !== profile?.name) payload.name = name;
      if (password) payload.password = password;

      if (Object.keys(payload).length === 0) {
        setIsUpdating(false);
        return;
      }

      const response = await api.patch("/users/current", payload);
      setProfile(response.data.data);
      setUpdateSuccess("Profil berhasil diperbarui!");
      setPassword(""); // reset password field
    } catch (error: any) {
      setUpdateError(error.response?.data?.error || "Gagal memperbarui profil");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Kartu Info Profil */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <UserIcon className="text-indigo-600" /> Profil Saya
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <User />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Nama Lengkap</p>
              <p className="text-gray-900 font-semibold">{profile?.name}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Mail />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-gray-900 font-semibold">{profile?.email}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Calendar />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Bergabung Sejak</p>
              <p className="text-gray-900 font-semibold">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                }) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu Update Profil */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Key className="text-gray-500" /> Perbarui Profil
        </h3>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          {updateSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100">
              {updateSuccess}
            </div>
          )}
          {updateError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {updateError}
            </div>
          )}

          <Input
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ubah nama Anda"
          />
          
          <Input
            label="Password Baru"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kosongkan jika tidak ingin mengubah password"
          />

          <div className="pt-2">
            <Button type="submit" isLoading={isUpdating}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
