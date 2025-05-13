'use client';

import React, { useState } from 'react';
import { useDevices } from '@/hooks/useDevices';
import Button from '@/global/components/base/Button';
import ConfirmDialog from '@/global/components/ui/ConfirmDialog';
import InputPromptModal from '@/global/components/ui/InputPromptModal';
import styles from './styles/categories-manager.module.scss';

export default function CategoriesManager() {
  const {
    devices: categories,
    loading,
    error,
    addDevice: addCategory,
    updateDevice: updateCategory,
    deleteDevice: deleteCategory,
  } = useDevices();

  const [expandedCategories, setExpandedCategories] = useState({});
  const [promptData, setPromptData] = useState(null); // { mode, label, initialValue, onSubmit }
  const [confirmData, setConfirmData] = useState(null); // { message, onConfirm }

  const toggleExpand = (id) =>
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddEntry = async (name, type, parent = '') => {
    await addCategory({ name, type, parent });
  };

  const handleUpdateEntry = async (id, updatedData) => {
    await updateCategory(id, updatedData);
  };

  const handleDeleteEntry = async (id) => {
    await deleteCategory(id);
  };

  const buildNestedStructure = () => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    const nested = [];
    categories.forEach((cat) => {
      if (cat.parent) {
        map[cat.parent]?.children.push(map[cat.id]);
      } else {
        nested.push(map[cat.id]);
      }
    });

    return nested;
  };

  const renderCategories = (cats) => (
    <ul className={styles['categories-list']}>
      {cats.map((category) => (
        <li key={category.id} className={styles['category-item']}>
          <div
            className={styles['category-details']}
            onClick={() => toggleExpand(category.id)}
          >
            <span>
              {category.name} ({category.type})
            </span>

            <div className={styles['category-actions']}>
              <Button
                size="s"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptData({
                    label: 'Enter new name',
                    initialValue: category.name,
                    confirmLabel: 'Save',
                    onSubmit: (value) =>
                      handleUpdateEntry(category.id, { name: value }),
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
                    message: 'Are you sure you want to delete this entry?',
                    onConfirm: () => handleDeleteEntry(category.id),
                  });
                }}
              >
                Delete
              </Button>
            </div>
          </div>

          {expandedCategories[category.id] && category.children.length > 0 && (
            <div className={styles['nested-categories']}>
              {renderCategories(category.children)}
            </div>
          )}

          {expandedCategories[category.id] && category.type === 'brand' && (
            <div className={styles['add-child-container']}>
              <Button
                size="s"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptData({
                    label: 'Enter new series name',
                    confirmLabel: 'Add Series',
                    onSubmit: (value) =>
                      handleAddEntry(value, 'series', category.id),
                  });
                }}
              >
                Add Series
              </Button>
            </div>
          )}

          {expandedCategories[category.id] && category.type === 'series' && (
            <div className={styles['add-child-container']}>
              <Button
                size="s"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPromptData({
                    label: 'Enter new model name',
                    confirmLabel: 'Add Model',
                    onSubmit: (value) =>
                      handleAddEntry(value, 'model', category.id),
                  });
                }}
              >
                Add Model
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles['manager-container']}>
      <Button
        variant="primary"
        size="s"
        onClick={() =>
          setPromptData({
            label: 'Enter new brand name',
            confirmLabel: 'Add Brand',
            onSubmit: (value) => handleAddEntry(value, 'brand'),
          })
        }
      >
        Add New Brand
      </Button>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        renderCategories(buildNestedStructure())
      )}

      {error && <p className={styles['error-message']}>{error}</p>}

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
