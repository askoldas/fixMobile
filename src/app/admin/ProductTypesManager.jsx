'use client';

import React, { useEffect, useState } from 'react';
import {
  addDocument,
  updateDocument,
  deleteDocument,
  fetchDocuments,
} from '@/lib/firebaseUtils';

import Button from '@/global/components/base/Button';
import ConfirmDialog from '@/global/components/ui/ConfirmDialog';
import InputPromptModal from '@/global/components/ui/InputPromptModal';
import styles from './styles/product-types-manager.module.scss';

export default function ProductTypesManager() {
  const [productTypes, setProductTypes] = useState([]);
  const [expandedTypes, setExpandedTypes] = useState({});
  const [promptData, setPromptData] = useState(null); // { label, confirmLabel, onSubmit, initialValue }
  const [confirmData, setConfirmData] = useState(null); // { message, onConfirm }

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await fetchDocuments('ProductTypes');
        setProductTypes(data);
      } catch (err) {
        console.error('Error fetching product types:', err);
        setPromptData({
          label: 'Error loading types.',
          confirmLabel: 'OK',
          onSubmit: () => {},
        });
      }
    };

    fetchProductTypes();
  }, []);

  const handleAddType = async (name, parent = null) => {
    const newType = { name, parent };
    const addedType = await addDocument('ProductTypes', newType);
    setProductTypes((prev) => [...prev, addedType]);
  };

  const handleUpdateType = async (id, updatedData) => {
    await updateDocument('ProductTypes', id, updatedData);
    setProductTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
  };

  const handleDeleteType = async (id) => {
    const deleteRecursively = async (parentId) => {
      const children = productTypes.filter((t) => t.parent === parentId);
      for (const child of children) {
        await deleteDocument('ProductTypes', child.id);
      }
      await deleteDocument('ProductTypes', parentId);
    };

    await deleteRecursively(id);
    setProductTypes((prev) =>
      prev.filter((t) => t.id !== id && t.parent !== id)
    );
  };

  const toggleExpand = (id) =>
    setExpandedTypes((prev) => ({ ...prev, [id]: !prev[id] }));

  const buildNestedStructure = (parentId = null, depth = 0) => {
    if (depth > 1) return [];
    return productTypes
      .filter((t) => t.parent === parentId)
      .map((t) => ({
        ...t,
        children: buildNestedStructure(t.id, depth + 1),
      }));
  };

  const renderProductTypes = (types, depth = 0) => (
    <ul className={styles['types-list']}>
      {types.map((type) => (
        <li key={type.id} className={styles['type-item']}>
          <div
            className={styles['type-details']}
            onClick={() => toggleExpand(type.id)}
          >
            <span>{type.name}</span>
            <div className={styles['type-actions']}>
              <Button
                size="s"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptData({
                    label: 'Edit product type name',
                    confirmLabel: 'Save',
                    initialValue: type.name,
                    onSubmit: (name) =>
                      handleUpdateType(type.id, { name }),
                  });
                }}
              >
                Edit
              </Button>
              <Button
                size="s"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmData({
                    message:
                      'Are you sure you want to delete this product type and its subcategories?',
                    onConfirm: () => handleDeleteType(type.id),
                  });
                }}
              >
                Delete
              </Button>
            </div>
          </div>

          {expandedTypes[type.id] && type.children.length > 0 && (
            <div className={styles['nested-types']}>
              {renderProductTypes(type.children, depth + 1)}
            </div>
          )}

          {expandedTypes[type.id] && depth < 1 && (
            <div className={styles['add-child-container']}>
              <Button
                size="s"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptData({
                    label: 'Enter subcategory name',
                    confirmLabel: 'Add',
                    onSubmit: (name) => handleAddType(name, type.id),
                  });
                }}
              >
                Add Subcategory
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles['manager-container']}>
      <h3>Product Types</h3>
      <Button
        variant="primary"
        size="s"
        onClick={() =>
          setPromptData({
            label: 'Enter new product type name',
            confirmLabel: 'Add',
            onSubmit: (name) => handleAddType(name),
          })
        }
      >
        Add New Product Type
      </Button>

      {renderProductTypes(buildNestedStructure())}

      <InputPromptModal
        isOpen={!!promptData}
        label={promptData?.label}
        confirmLabel={promptData?.confirmLabel}
        initialValue={promptData?.initialValue || ''}
        onSubmit={(value) => {
          promptData?.onSubmit(value);
          setPromptData(null);
        }}
        onClose={() => setPromptData(null)}
      />

      <ConfirmDialog
        isOpen={!!confirmData}
        message={confirmData?.message}
        onConfirm={() => {
          confirmData?.onConfirm();
          setConfirmData(null);
        }}
        onClose={() => setConfirmData(null)}
      />
    </div>
  );
}
