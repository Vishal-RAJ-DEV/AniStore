import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaTags } from "react-icons/fa";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categotyApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  // Query and mutations
  const { data: categories, isLoading, isError, error, refetch } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  
  // State variables
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Reset form after create operation
  useEffect(() => {
    if (!isCreating) {
      setName("");
    }
  }, [isCreating]);

  // Create category handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result) {
        setName("");
        toast.success(`${result.name} category created`);
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  // Update category handler
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        name: updatingName,
      }).unwrap();

      if (result) {
        toast.success(`${result.name} category updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category");
    }
  };

  // Delete category handler
  const handleDeleteCategory = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result) {
        toast.success(`${result.name} category deleted`);
        setSelectedCategory(null);
        setModalVisible(false);
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  // Open modal with selected category
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Space for AdminMenu component */}
      <div className="mb-8">
        <AdminMenu />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Create category form */}
        <div className="col-span-1">
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Create Category"
          />
        </div>

        {/* Right: Categories list */}
        <div className="lg:col-span-2">
          <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-[#333]">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
              <FaTags className="mr-2 text-[#ff6b9d]" />
              Categories
            </h2>

            {isLoading ? (
              <Loader />
            ) : isError ? (
              <Message variant="error">
                {error?.data?.message || "Error loading categories"}
              </Message>
            ) : categories?.length === 0 ? (
              <p className="text-gray-400">No categories found. Create one to get started.</p>
            ) : (
              <div className="space-y-2">
                {categories?.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333] transition-colors"
                  >
                    <span className="text-white font-medium">{category.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="p-2 text-gray-300 hover:text-[#ff6b9d] focus:outline-none transition-colors"
                        disabled={isDeleting || isUpdating}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for updating/deleting category */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        {selectedCategory && (
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        )}
      </Modal>
    </div>
  );
};

export default CategoryList;