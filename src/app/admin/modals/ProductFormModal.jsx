import React, { useState } from "react";
import ProductEditor from "../components/ProductEditor";
import ConfirmDialog from "@/global/components/ui/ConfirmDialog";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData = null,
  categories = [],
  productTypes = [],
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const isEditing = !!initialData?.id;

  const triggerDeleteConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmedDelete = () => {
    if (initialData?.id) {
      onDelete(initialData.id);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          width: "90%",
          maxWidth: "1000px",
        }}
      >
        <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>
        <ProductEditor
          productData={initialData}
          categories={categories}
          productTypes={productTypes}
          onSave={(data) => {
            onSubmit(data);
            onClose();
          }}
          onCancel={onClose}
          onDelete={isEditing ? triggerDeleteConfirm : undefined}
        />
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this product?"
        onConfirm={handleConfirmedDelete}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
}
