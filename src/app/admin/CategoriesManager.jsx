'use client';

import React, { useState } from 'react';
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

import { useDevices } from '@/hooks/useDevices';
import Button from '@/global/components/base/Button';
import ConfirmDialog from '@/global/components/ui/ConfirmDialog';
import InputPromptModal from '@/global/components/ui/InputPromptModal';
import styles from './styles/categories-manager.module.scss';

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
    <li ref={setNodeRef} style={style} className={styles['category-item']}>
      {children(renderHandle({ listeners, attributes }))}
    </li>
  );
}

export default function CategoriesManager() {
  const {
    devices: categories,
    loading,
    error,
    addDevice: addCategory,
    updateDevice: updateCategory,
    deleteDevice: deleteCategory,
    setDevices: setCategories,
  } = useDevices();

  const [expandedCategories, setExpandedCategories] = useState({});
  const [promptData, setPromptData] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const toggleExpand = (id) =>
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddEntry = async (name, type, parent = '') => {
    const id = slugify(name, { lower: true });
    const siblings = categories.filter((t) => (t.parent ?? '') === parent);
    const order = siblings.length;
    await addCategory({ id, name, type, parent, order });
  };

  const handleUpdateEntry = async (id, updatedData) => {
    await updateCategory(id, updatedData);
  };

  const handleDeleteEntry = async (id) => {
    await deleteCategory(id);
  };

  const buildNestedStructure = (parentId = '') => {
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

    const sortRecursive = (list) =>
      list
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({ ...item, children: sortRecursive(item.children) }));

    return sortRecursive(nested);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const dragged = categories.find((c) => c.id === active.id);
    if (!dragged) return;

    const parent = dragged.parent ?? '';
    const siblings = categories
      .filter((c) => (c.parent ?? '') === parent)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const oldIndex = siblings.findIndex((c) => c.id === active.id);
    const newIndex = siblings.findIndex((c) => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(siblings, oldIndex, newIndex);

    reordered.forEach((item, index) => {
      item.order = index;
      updateCategory(item.id, { order: index });
    });

    const updated = categories.map((c) => {
      const match = reordered.find((r) => r.id === c.id);
      return match ? { ...match } : c;
    });

    setCategories(updated);
  };

  const renderCategories = (types, depth = 0) => (
    <SortableContext items={types.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      <ul className={styles['categories-list']}>
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
              <>
                <div
                  className={styles['category-details']}
                  onClick={() => toggleExpand(type.id)}
                >
                  <span>{type.name} ({type.type})</span>
                  <div className={styles['category-actions']}>
                    {dragHandle}
                    <Button
                      size="s"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPromptData({
                          label: 'Enter new name',
                          initialValue: type.name,
                          confirmLabel: 'Save',
                          onSubmit: (value) => handleUpdateEntry(type.id, { name: value }),
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
                          onConfirm: () => handleDeleteEntry(type.id),
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {expandedCategories[type.id] && (
                  <>
                    {type.children.length > 0 && (
                      <div className={styles['nested-categories']}>
                        {renderCategories(type.children, depth + 1)}
                      </div>
                    )}
                    {type.type === 'brand' && (
                      <div className={styles['add-child-container']}>
                        <Button
                          size="s"
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPromptData({
                              label: 'Enter new series name',
                              confirmLabel: 'Add Series',
                              onSubmit: (value) => handleAddEntry(value, 'series', type.id),
                            });
                          }}
                        >
                          Add Series
                        </Button>
                      </div>
                    )}
                    {type.type === 'series' && (
                      <div className={styles['add-child-container']}>
                        <Button
                          size="s"
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPromptData({
                              label: 'Enter new model name',
                              confirmLabel: 'Add Model',
                              onSubmit: (value) => handleAddEntry(value, 'model', type.id),
                            });
                          }}
                        >
                          Add Model
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </SortableItem>
        ))}
      </ul>
    </SortableContext>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          renderCategories(buildNestedStructure())
        )}
      </DndContext>

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
