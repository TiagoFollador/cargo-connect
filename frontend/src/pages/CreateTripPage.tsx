import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreateTripForm } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { shipmentService } from "../services/shipmentService";
import { utilsService, CargoType, VehicleType } from "../services/utilsService";

const CreateTripPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateTripForm>({
    title: "",
    description: "",
    cargo_type_id: 0,
    weight_kg: 0,
    volume_m3: 0,
    pickup_location: "",
    pickup_date: "",
    delivery_location: "",
    delivery_date: "",
    required_vehicle_type_id: 0,
    price_offer: 0,
  });

  const [errors, setErrors] = useState<Partial<CreateTripForm>>({});
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cargoTypesData, vehicleTypesData] = await Promise.all([
          utilsService.getCargoTypes(),
          utilsService.getVehicleTypes(),
        ]);
        setCargoTypes(cargoTypesData);
        setVehicleTypes(vehicleTypesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("_id") ||
        name.includes("_kg") ||
        name.includes("_m3") ||
        name === "price_offer"
          ? Number(value) || 0
          : value,
    }));

    if (errors[name as keyof CreateTripForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTripForm> = {};

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.cargo_type_id)
      newErrors.cargo_type_id = "Tipo de carga é obrigatório";
    if (!formData.weight_kg || formData.weight_kg <= 0)
      newErrors.weight_kg = "Peso deve ser maior que zero";
    if (!formData.pickup_location.trim())
      newErrors.pickup_location = "Local de coleta é obrigatório";
    if (!formData.pickup_date)
      newErrors.pickup_date = "Data de coleta é obrigatória";
    if (!formData.delivery_location.trim())
      newErrors.delivery_location = "Local de entrega é obrigatório";
    if (!formData.delivery_date)
      newErrors.delivery_date = "Data de entrega é obrigatória";

    if (
      formData.pickup_date &&
      formData.delivery_date &&
      formData.pickup_date >= formData.delivery_date
    ) {
      newErrors.delivery_date =
        "Data de entrega deve ser posterior à data de coleta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user) {
      alert("Você precisa estar logado para criar uma viagem.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const shipmentData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || undefined,
        cargo_type_id: formData.cargo_type_id,
        weight_kg: formData.weight_kg,
        volume_m3: formData.volume_m3 || undefined,
        pickup_location: formData.pickup_location,
        pickup_date: formData.pickup_date,
        delivery_location: formData.delivery_location,
        delivery_date: formData.delivery_date,
        required_vehicle_type_id:
          formData.required_vehicle_type_id || undefined,
        price_offer: formData.price_offer || undefined,
      };

      await shipmentService.createShipment(shipmentData);
      alert("Viagem criada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message || "Erro ao criar viagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-primary hover:text-primary-light"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar ao Painel</span>
        </Link>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Criar Nova Viagem
          </h1>
          <p className="mt-2 text-text-secondary">
            Preencha os detalhes da sua carga para encontrar transportadores
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card">
            <h2 className="mb-6 text-xl font-semibold text-text-primary">
              Informações Básicas
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-text-primary"
                >
                  Título da Viagem *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input mt-1 w-full ${errors.title ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Ex: Transporte de móveis"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cargo_type_id"
                  className="block text-sm font-medium text-text-primary"
                >
                  Tipo de Carga *
                </label>
                <select
                  id="cargo_type_id"
                  name="cargo_type_id"
                  value={formData.cargo_type_id}
                  onChange={handleInputChange}
                  className={`input mt-1 w-full ${errors.cargo_type_id ? "border-red-500 focus:ring-red-500" : ""}`}
                >
                  <option value={0}>Selecione o tipo de carga</option>
                  {cargoTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.cargo_type_id && (
                  <p className="mt-1 text-sm text-error">
                    {errors.cargo_type_id}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-primary"
              >
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="input mt-1 w-full"
                placeholder="Descreva detalhes adicionais sobre a carga..."
              />
            </div>
          </div>

          <div className="card">
            <h2 className="mb-6 text-xl font-semibold text-text-primary">
              Especificações da Carga
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="weight_kg"
                  className="block text-sm font-medium text-text-primary"
                >
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  id="weight_kg"
                  name="weight_kg"
                  value={formData.weight_kg || ""}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`input mt-1 w-full ${errors.weight_kg ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="0.00"
                />
                {errors.weight_kg && (
                  <p className="mt-1 text-sm text-error">{errors.weight_kg}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="volume_m3"
                  className="block text-sm font-medium text-text-primary"
                >
                  Volume (m³)
                </label>
                <input
                  type="number"
                  id="volume_m3"
                  name="volume_m3"
                  value={formData.volume_m3 || ""}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="input mt-1 w-full"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  htmlFor="required_vehicle_type_id"
                  className="block text-sm font-medium text-text-primary"
                >
                  Tipo de Veículo Preferido
                </label>
                <select
                  id="required_vehicle_type_id"
                  name="required_vehicle_type_id"
                  value={formData.required_vehicle_type_id || 0}
                  onChange={handleInputChange}
                  className="input mt-1 w-full"
                >
                  <option value={0}>Qualquer tipo</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}{" "}
                      {type.capacity_kg && `(${type.capacity_kg}kg)`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-6 text-xl font-semibold text-text-primary">
              Locais e Datas
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="pickup_location"
                  className="block text-sm font-medium text-text-primary"
                >
                  Local de Coleta *
                </label>
                <input
                  type="text"
                  id="pickup_location"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleInputChange}
                  className={`input mt-1 w-full ${errors.pickup_location ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Ex: São Paulo, SP"
                />
                {errors.pickup_location && (
                  <p className="mt-1 text-sm text-error">
                    {errors.pickup_location}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="delivery_location"
                  className="block text-sm font-medium text-text-primary"
                >
                  Local de Entrega *
                </label>
                <input
                  type="text"
                  id="delivery_location"
                  name="delivery_location"
                  value={formData.delivery_location}
                  onChange={handleInputChange}
                  className={`input mt-1 w-full ${errors.delivery_location ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Ex: Rio de Janeiro, RJ"
                />
                {errors.delivery_location && (
                  <p className="mt-1 text-sm text-error">
                    {errors.delivery_location}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pickup_date"
                  className="block text-sm font-medium text-text-primary"
                >
                  Data de Coleta *
                </label>
                <input
                  type="datetime-local"
                  id="pickup_date"
                  name="pickup_date"
                  value={formData.pickup_date}
                  onChange={handleInputChange}
                  className={`input mt-1 w-full ${errors.pickup_date ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.pickup_date && (
                  <p className="mt-1 text-sm text-error">
                    {errors.pickup_date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="delivery_date"
                  className="block text-sm font-medium text-text-primary"
                >
                  Data de Entrega *
                </label>
                <input
                  type="datetime-local"
                  id="delivery_date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  className={`input mt-1 w-full ${errors.delivery_date ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.delivery_date && (
                  <p className="mt-1 text-sm text-error">
                    {errors.delivery_date}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-6 text-xl font-semibold text-text-primary">
              Preço
            </h2>

            <div className="max-w-md">
              <label
                htmlFor="price_offer"
                className="block text-sm font-medium text-text-primary"
              >
                Oferta de Preço (R$)
              </label>
              <input
                type="number"
                id="price_offer"
                name="price_offer"
                value={formData.price_offer || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="input mt-1 w-full"
                placeholder="0.00"
              />
              <p className="mt-1 text-sm text-text-secondary">
                Deixe em branco para receber propostas dos transportadores
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                *Taxa de 10% será descontado do valor da oferta
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link to="/dashboard" className="btn btn-outline">
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Criar Viagem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripPage;
