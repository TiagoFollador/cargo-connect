import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { shipmentService } from '../../services/shipmentService';
import { utilsService } from '../../services/utilsService';

interface EditTripModalProps {
  trip: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditTripModal: React.FC<EditTripModalProps> = ({ 
  trip, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cargo_type_id: 0,
    weight_kg: 0,
    volume_m3: 0,
    pickup_location: '',
    pickup_date: '',
    delivery_location: '',
    delivery_date: '',
    required_vehicle_type_id: 0,
    price_offer: 0
  });
  
  const [cargoTypes, setCargoTypes] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && trip) {
      setFormData({
        title: trip.title || '',
        description: trip.description || '',
        cargo_type_id: trip.cargo_type_id || 0,
        weight_kg: trip.weight_kg || 0,
        volume_m3: trip.volume_m3 || 0,
        pickup_location: trip.pickup_location || '',
        pickup_date: trip.pickup_date ? trip.pickup_date.slice(0, 16) : '',
        delivery_location: trip.delivery_location || '',
        delivery_date: trip.delivery_date ? trip.delivery_date.slice(0, 16) : '',
        required_vehicle_type_id: trip.required_vehicle_type_id || 0,
        price_offer: trip.price_offer || 0
      });
      loadData();
    }
  }, [isOpen, trip]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cargoTypesData, vehicleTypesData] = await Promise.all([
        utilsService.getCargoTypes(),
        utilsService.getVehicleTypes(),
      ]);
      setCargoTypes(cargoTypesData);
      setVehicleTypes(vehicleTypesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_id') || name.includes('_kg') || name.includes('_m3') || name === 'price_offer'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pickup_location || !formData.delivery_location) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setIsSaving(true);
      await shipmentService.updateShipment(trip.id, formData);
      onSave();
    } catch (error: any) {
      alert('Erro ao atualizar viagem: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Editar Viagem
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Título da Viagem *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tipo de Carga *
              </label>
              <select
                name="cargo_type_id"
                value={formData.cargo_type_id}
                onChange={handleInputChange}
                className="input w-full"
                required
              >
                <option value={0}>Selecione o tipo de carga</option>
                {cargoTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Volume (m³)
              </label>
              <input
                type="number"
                name="volume_m3"
                value={formData.volume_m3}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tipo de Veículo
              </label>
              <select
                name="required_vehicle_type_id"
                value={formData.required_vehicle_type_id}
                onChange={handleInputChange}
                className="input w-full"
              >
                <option value={0}>Qualquer veículo</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Local de Coleta *
              </label>
              <input
                type="text"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Local de Entrega *
              </label>
              <input
                type="text"
                name="delivery_location"
                value={formData.delivery_location}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Data e Hora de Coleta *
              </label>
              <input
                type="datetime-local"
                name="pickup_date"
                value={formData.pickup_date}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Data e Hora de Entrega *
              </label>
              <input
                type="datetime-local"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Valor Oferecido (R$)
            </label>
            <input
              type="number"
              name="price_offer"
              value={formData.price_offer}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="input w-full"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="btn btn-primary flex-1"
            >
              {isSaving ? (
                'Salvando...'
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;
