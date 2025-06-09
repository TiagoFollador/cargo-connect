import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Star,
  Calendar,
  Camera,
  Save,
  Edit3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profile_picture_url: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profile_picture_url: user.profile_picture_url || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await userService.updateUser(user.id, formData);
      setSuccess("Perfil atualizado com sucesso!");
      setIsEditing(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profile_picture_url: user.profile_picture_url || "",
      });
    }
    setIsEditing(false);
    setError("");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-text-secondary">Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Meu Perfil</h1>
          <p className="mt-2 text-text-secondary">
            Gerencie suas informações pessoais
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Informações Pessoais
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.profile_picture_url ? (
                    <img
                      src={formData.profile_picture_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">
                  {user.name}
                </h3>
                <p className="text-text-secondary">
                  {user.roles?.join(", ") || "Usuário"}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-text-secondary">
                      {user.rating || 0}/5
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {user.trips_completed || 0} viagens concluídas
                  </div>
                </div>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.roles
                      ?.map((role) =>
                        role === "shipper"
                          ? "Embarcador"
                          : role === "carrier"
                            ? "Transportador"
                            : role === "admin"
                              ? "Administrador"
                              : role
                      )
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input pl-10"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input pl-10 bg-gray-50"
                    placeholder="seu@email.com"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input pl-10"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Membro desde
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={
                      user.created_at
                        ? new Date(user.created_at).toLocaleDateString("pt-BR")
                        : "N/A"
                    }
                    disabled
                    className="input pl-10 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  URL da Foto de Perfil
                </label>
                <input
                  type="url"
                  name="profile_picture_url"
                  value={formData.profile_picture_url}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
            )}

            {isEditing && (
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center space-x-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? "Salvando..." : "Salvar Alterações"}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Estatísticas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user.trips_completed || 0}
              </div>
              <div className="text-sm text-text-secondary">
                Viagens Concluídas
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user.rating || 0}
              </div>
              <div className="text-sm text-text-secondary">Avaliação Média</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user.created_at
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(user.created_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 0}
              </div>
              <div className="text-sm text-text-secondary">
                Dias na Plataforma
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user.last_login
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(user.last_login).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : "N/A"}
              </div>
              <div className="text-sm text-text-secondary">
                Último Login (dias)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
