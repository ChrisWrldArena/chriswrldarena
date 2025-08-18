/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { ReactNode, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import Link from 'next/link';
import { Edit2, LoaderCircle, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T, rowIndex: number, colIndex: number) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T, index: number) => void;
  className?: string;
}

export interface TableHeader {
  title: string;
  badge?: string;
  badgeColor?: string;
  onTitleEdit?: (title: string) => void;
  isAdmin?: boolean;
}

export interface TableFooter {
  emptyMessage?: string;
  viewMoreLink?: string;
  viewMoreText?: string;
  customActions?: React.ReactNode;
}

interface TableProps<T> {
  data: any[];
  columns: Column<T>[];
  actions?: Action<T>[];
  pageSize?: number;
  slice?: number;
  header?: TableHeader;
  footer?: TableFooter;
  loading?: boolean;
  currentPosition?: number;
  updating?: boolean;
  uniqueId?: string;
  className?: string;
  component?: ReactNode;
}

export function TableComponent<T>({
  data,
  columns,
  actions,
  pageSize = 25,
  slice,
  header,
  footer,
  loading = false,
  currentPosition = -1,
  updating = false,
  uniqueId,
  className = '',
  component,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // If slice is provided, use it instead of pagination
  const displayData = slice ? data.slice(0, slice).sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    : data.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());

  // Calculate pagination values
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Get current page data if not sliced
  const currentData = slice ? displayData : displayData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoaderCircle className="animate-spin size-8" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-max ${clsx(className)} `}>
      {/* Header Section */}
      {header && (
        <div className="p-6 bg-gradient-to-r from-green-950 to-green-900 border-b border-gray-200">
          <div className="relative flex flex-col lg:flex-row gap-4 items-center justify-between">
            {header.badge && (
              <span className={`absolute left-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${header.badgeColor || 'bg-green-400 text-gray-900'}`}>
                {header.badge}
              </span>
            )}
            <h3 className={`text-sm sm:text-xl font-bold text-white flex items-center gap-2 ${header.badge && "ml-20"} uppercase`}>
              {header.title}
              {header.isAdmin && header.onTitleEdit && (
                <span
                  className="inline-flex cursor-pointer items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-400 text-gray-900"
                  onClick={() => header.onTitleEdit?.(header.title)}>
                  <Edit2 className="size-4" />&nbsp;Edit
                </span>
              )}
            </h3>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className={`bg-white rounded-xl overflow-hidden h-max `}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index + column.header}
                    className={`px-2 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider ${column.accessorKey === 'publishedAt' ? 'hidden md:table-cell' : ''}`}
                  >
                    {column.header}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentData.map((item, index) => (
                <>
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors odd:bg-neutral-100"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex + Math.random().toString(36).substring(2, 8)}
                        className={`px-2 py-2 text-sm text-gray-600 min-w-0 ${column.accessorKey === 'publishedAt' ? 'hidden md:table-cell' : ''}`}
                      >
                        <div className="break-words text-xs sm:text-sm lg:max-w-xs xl:max-w-sm 2xl:max-w-md">
                          {column.cell ? column.cell(item, index, currentData[index].id) : String(item[column.accessorKey] || '')}
                        </div>
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="relative px-2 py-2 w-10">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="focus:outline-none"
                              tabIndex={0}
                              aria-label="Show actions"
                              type="button"
                            >
                              <MoreVertical className="text-neutral-500 cursor-pointer hover:text-neutral-600 size-4 sm:size-5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="z-50 p-0 w-40 bg-white border border-gray-200 rounded shadow-lg"
                          >
                            <div className="flex flex-col">
                              {actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  className={`w-full flex items-center gap-2 text-left px-4 py-2 text-sm ${action.className || 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                  onClick={() => {
                                    action.onClick(item, actionIndex);
                                  }}
                                  disabled={updating && actionIndex === currentPosition}>
                                  {action.icon}
                                  {updating && actionIndex === currentPosition ? (
                                    <LoaderCircle className="animate-spin size-4" />
                                  ) : (
                                    action.label
                                  )}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    )}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          {component && component}
        </div>

        {/* Footer Section */}
        {footer && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {!data.length && <h1 className="text-lg text-center my-8 py-4 -mx-10 bg-gray-100">{footer.emptyMessage || 'Empty List'}</h1>}
            <div className="flex items-center justify-center my-1">
              {footer.viewMoreLink && slice && data.length > slice && (
                <Link
                  href={footer.viewMoreLink}
                  className="px-4 py-2 underline underline-offset-4 text-sm font-medium text-gray-900 hover:text-green-600 transition-all duration-300"
                >
                  {footer.viewMoreText}
                </Link>
              )}
              {footer.customActions}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!slice && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <span key={page}>...</span>;
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
