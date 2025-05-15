'use client';

import React, { useEffect, useState, useRef } from 'react';
import slugify from 'slugify';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  addDocument,
  updateDocument,
  deleteDocument,
  fetchDocuments,
} from '@/lib/firebaseUtils';

import Button from '@/global/components/base/Button';
import ConfirmDialog from '@/global/components/ui/ConfirmDialog';
import InputPromptModal from '@/global/components/ui/InputPromptModal';
import { buildNestedListStructure } from '@/utils/buildNestedListStructure';
import styles from './styles/product-types-manager.module.scss';

function SortableItem({ id, children, renderHandle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className={styles['sortable-item']}>
      {children(renderHandle({ listeners, attributes }))}
    </li>
  );
}

export default function ProductTypesManager() {
  const [productTypes, setProductTypes] = useState([]);
  const [expandedTypes, setExpandedTypes] = useState({});
  const [promptData, setPromptData] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await fetchDocuments('ProductTypes');
        setProductTypes(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (err) {
        console.error('Error fetching product types:', err);
        setPromptData({
          label: 'Error loading types.',
          confirmLabel: 'OK',
          onSubmit: () => { },
        });
      }
    };

    fetchProductTypes();
  }, []);

  const handleAddType = async (name, parent = null) => {
    const id = slugify(name, { lower: true });
    const siblings = productTypes.filter((t) => t.parent === parent);
    const order = siblings.length;
    const newType = { id, name, parent, order };

    const addedType = await addDocument('ProductTypes', newType, id);
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


  const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const dragged = productTypes.find((t) => t.id === active.id);
  if (!dragged) return;

  const parent = dragged.parent ?? null;
  const siblings = productTypes.filter((t) => t.parent === parent);

  const oldIndex = siblings.findIndex((t) => t.id === active.id);
  const newIndex = siblings.findIndex((t) => t.id === over.id);

  const reordered = arrayMove(siblings, oldIndex, newIndex);
  const updated = productTypes.map((t) => {
    const match = reordered.find((r) => r.id === t.id);
    return match ? { ...match, order: reordered.indexOf(match) } : t;
  });

  setProductTypes(updated);

  reordered.forEach((t, i) => {
    updateDocument('ProductTypes', t.id, { order: i });
  });
};

  const renderProductTypes = (types, depth = 0) => (
    <SortableContext items={types.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      <ul className={styles['types-list']}>
        {types.map((type) => (
          <SortableItem
  key={type.id}
  id={type.id}
  renderHandle={({ listeners, attributes }) => (
    <button
      type="button"
      className={styles['drag-button']}
      {...listeners}
      {...attributes}
      onClick={(e) => e.stopPropagation()}
      style={{ cursor: 'grab' }}
    >
      ↕
    </button>
  )}
          >
            {(dragHandle) => (
              <div
                className={styles['type-item']}
                onClick={() => toggleExpand(type.id)}
              >
                <div className={styles['type-details']}>
                  <span>{type.name}</span>
                  <div className={styles['type-actions']}>
                    {dragHandle}
                    <Button
                      size="s"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPromptData({
                          label: 'Edit product type name',
                          confirmLabel: 'Save',
                          initialValue: type.name,
                          onSubmit: (name) => handleUpdateType(type.id, { name }),
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
              </div>
            )}
          </SortableItem>
        ))}
      </ul>
    </SortableContext>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {renderProductTypes(buildNestedListStructure(productTypes))}
      </DndContext>

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