import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import DataTable, { type Column } from '@/components/ui/DataTable';
import { useToast } from '@/context/useToast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import type { VehicleCategory } from '@/types/vehicle.types';

import AddCategoryModal from '../../components/ui/AddCategoryModal';
import RemoveCategoryModal from '../../components/ui/RemoveCategoryModal';
import { vehicleDatabaseData } from '../../data/VehicleDatabaseData';
import type { VehicleDatabaseRow } from '../../data/VehicleDatabaseData';

const VehicleInventoryPage: React.FC = () => {
  const {
    categories: vehicleCategories,
    loading,
    error,
    updateCategory,
    createCategory,
    removeCategory,
  } = useVehicleCategories();
  const { uploadImage } = useFileUpload();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'category' | 'database'>('category');
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState<string | number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<VehicleCategory | null>(null);

  // Pagination and search for database tab
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredData = vehicleDatabaseData.filter((vehicle) => {
    return (
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licencePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Electric':
        return 'bg-[#EEFFFD] text-[#1DAFA1]';
      case 'Standard':
        return 'bg-[#FFF3D4] text-[#F6921E]';
      case 'XL':
        return 'bg-[#EEF3FF] text-[#007AEB]';
      case 'Executive (Premium)':
        return 'bg-[#F3EEFF] text-[#4D00FF]';
      case 'Executive XL (Premium)':
        return 'bg-[#DCFCE7] text-[#00A63E]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRemoveClick = (id: string | number) => {
    setCategoryToRemove(id);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (categoryToRemove) {
      try {
        await removeCategory(categoryToRemove as string);
        setIsRemoveModalOpen(false);
        setCategoryToRemove(null);
        showToast('Category removed successfully', 'success');
      } catch (err) {
        console.error(err);
        showToast('Failed to remove category', 'error');
      }
    }
  };

  const vehicleColumns = useMemo<Column<VehicleDatabaseRow>[]>(
    () => [
      {
        key: 'name',
        label: 'VEHICAL',
        sortable: true,
        render: (vehicle) => (
          <div className="flex items-center gap-3">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-[40px] h-[40px] object-contain shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-[#1DAFA1] text-[14px]">{vehicle.name}</span>
              <span className="text-[12px] font-medium text-[#4E616A]">
                {vehicle.year} • {vehicle.color}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'category',
        label: 'CATEGORY',
        sortable: true,
        render: (vehicle) => (
          <span
            className={`px-4 py-1.5 rounded-[500px] text-[14px] font-medium whitespace-nowrap ${getCategoryTheme(vehicle.category)}`}
          >
            {vehicle.category}
          </span>
        ),
      },
      {
        key: 'licencePlate',
        label: 'LICENCE PLATE',
        sortable: true,
        render: (vehicle) => (
          <span className="text-[#4E616A] text-[14px] font-medium">{vehicle.licencePlate}</span>
        ),
      },
      {
        key: 'driver',
        label: 'DRIVER',
        sortable: true,
        render: (vehicle) => (
          <div className="flex items-center gap-3">
            <img
              src={vehicle.driver.image}
              alt={vehicle.driver.name}
              className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-[#1DAFA1] text-[14px]">{vehicle.driver.name}</span>
              <span className="text-[12px] font-medium text-[#4E616A]">{vehicle.driver.phone}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (vehicle) => (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${vehicle.status === 'Active' ? 'bg-[#00A63E]' : 'bg-[#FF0707]'}`}
            />
            <span
              className={`text-[12px] font-semibold ${vehicle.status === 'Active' ? 'text-[#00A63E]' : 'text-[#FF0707]'}`}
            >
              {vehicle.status}
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col bg-white p-1">
      {/* Tabs */}
      <div className="flex gap-8  mb-6">
        <button
          onClick={() => setActiveTab('category')}
          className={`pb-3 text-[14px] font-medium cursor-pointer transition-all relative ${activeTab === 'category' ? 'text-[#1DAFA1]' : 'text-[#4E616A]'
            }`}
        >
          Vehicle Category
          {activeTab === 'category' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1DAFA1]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 text-[14px] font-semibold cursor-pointer transition-all relative ${activeTab === 'database' ? 'text-[#1DAFA1]' : 'text-[#4E616A]'
            }`}
        >
          Vehicle Database
          {activeTab === 'database' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1DAFA1]" />
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'category' ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-[#000000]">Vehicle Categories</h2>
            <button
              onClick={() => {
                setCategoryToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex  cursor-pointer items-center gap-2 bg-[#1DAFA1] text-white px-4 py-2 rounded-sm font-semibold text-[14px]"
            >
              <img src="/icons/vehicle/add.svg" alt="add" className="w-[22px] h-[22px]" />
              Add Category
            </button>
          </div>

          {/* Grid of Cards */}
          {loading ? (
            <div className="flex justify-center items-center h-40">Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
              {vehicleCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="border border-[#DFE6E5] rounded-lg p-5 flex flex-col relative overflow-hidden w-full min-h-[160px]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="shrink-0 flex items-center justify-center">
                      <img
                        src={cat.categoryIcon}
                        alt={cat.name}
                        className="w-[120px] h-[120px] object-contain"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://img.freepik.com/free-vector/white-sedan-car-isolated-white-background_1308-100223.jpg';
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1 ml-1 pt-1">
                      <h3 className="text-[18px] font-semibold text-[#000000] mb-4">{cat.name}</h3>

                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-[#4E616A] font-medium">Seats</span>
                            <div className="flex items-center gap-2">
                              <img
                                src="/icons/vehicle/seats.svg"
                                alt="seats"
                                className="w-[22px] h-[22px]"
                              />
                              <span className="text-[14px] font-medium text-[#000000] whitespace-nowrap">
                                {cat.seats} Seats
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-[#4E616A] font-medium">
                              Base Price
                            </span>
                            <div className="flex items-center gap-2">
                              <img
                                src="/icons/vehicle/amount.svg"
                                alt="amount"
                                className="w-[22px] h-[22px]"
                              />
                              <span className="text-[14px] font-medium text-[#000000] whitespace-nowrap">
                                £{cat.basePrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-1">
                          <button
                            onClick={() => handleRemoveClick(cat.id)}
                            className="flex cursor-pointer items-center gap-1.5 text-[#FF0707] text-[14px] font-medium"
                          >
                            <img
                              src="/icons/vehicle/remove.svg"
                              alt="remove"
                              className="w-[22px] h-[22px]"
                            />
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              setCategoryToEdit(cat);
                              setIsAddModalOpen(true);
                            }}
                            className="flex cursor-pointer items-center gap-1.5 text-[#1DAFA1] text-[14px] font-medium"
                          >
                            <img
                              src="/icons/vehicle/edit.svg"
                              alt="edit"
                              className="w-[22px] h-[22px]"
                            />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col bg-white rounded-lg border border-[#DFE6E5]">
          {/* Search Bar */}
          <div className="p-4 border-b border-[#DFE6E5] flex justify-between items-center">
            <div className="relative w-[380px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-[22px] w-[22px] text-[#939999]" />
              </div>
              <input
                type="text"
                placeholder="Search here..."
                className="pl-10 pr-4 py-2 w-full border border-[#DFE6E5] rounded-sm text-[14px] focus:outline-none focus:ring-1 focus:ring-[#1DAFA1] focus:border-[#1DAFA1]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <DataTable<VehicleDatabaseRow>
            columns={vehicleColumns}
            data={currentData}
            rowKey={(v) => v.id}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            emptyText="No vehicles found matching your search."
          />
        </div>
      )}
      <RemoveCategoryModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
      />
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCategoryToEdit(null);
        }}
        initialData={categoryToEdit}
        onConfirm={async (values) => {
          let iconString = values.categoryIcon;

          if (iconString instanceof File) {
            try {
              iconString = await uploadImage(iconString as File);
            } catch (error) {
              console.error(error);
              showToast(
                error instanceof Error ? error.message : 'Image upload failed. Please try again.',
                'error',
              );
              return;
            }
          }

          const payload: Partial<VehicleCategory> = {
            name: values.categoryName,
            basePrice: parseFloat(values.baseFare),
            pricePerMile: parseFloat(values.pricePerMile),
            pricePerMinute: parseFloat(values.pricePerMinute),
            seats: parseInt(values.seatCapacity.split(' ')[0]),
            vehicleType: values.vehicleType,
          };

          if (iconString) {
            payload.categoryIcon = iconString as string;
          }

          if (categoryToEdit) {
            await updateCategory(categoryToEdit.id, payload);
          } else {
            await createCategory(payload);
          }

          setIsAddModalOpen(false);
          setCategoryToEdit(null);
        }}
      />
    </div>
  );
};

export default VehicleInventoryPage;
