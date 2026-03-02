// src/actions/todos/actions.js
'use server';  // Bắt buộc cho Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addTodo, deleteTodo, toggleTodo, getTodoById, updateTodo } from '@/server/todos/db';  // Import từ file db.js của bạn

// Action để thêm todo mới
export async function createTodo(formData) {
  const title = formData.get('title')?.toString().trim();

  if (!title) {
    return { error: 'Vui lòng nhập nội dung todo!' };
  }

  try {
    await addTodo({ title: title });  // Gọi hàm db
    revalidatePath('/');  // Refresh trang chủ để hiển thị todo mới
    //return { success: true };
  } catch (error) {
    console.error('Lỗi khi thêm todo:', error);
    //return { error: 'Có lỗi xảy ra khi thêm todo.' };
  }
}

// Action để xóa todo
export async function deleteTodoAction(formData) {
  const id = formData.get('id');

  if (!id) {
    console.error('ID không hợp lệ');
    return;  // hoặc throw new Error('ID không hợp lệ') nếu muốn error boundary catch
  }

  try {
    await deleteTodo({ id: Number(id) });
    revalidatePath('/');  // hoặc '/todos' nếu trang cụ thể
    // Không return gì cả → OK
  } catch (error) {
    console.error('Lỗi xóa todo:', error);
    // Không return error object → có thể throw nếu muốn hiển thị error page
    // throw new Error('Có lỗi khi xóa todo.');
  }
}


// Toggle completed chechked box todosnew
export async function toggleTodoAction(formData) {
  const rawId = formData.get('id');
  const id = Number(rawId);

  console.log('[ACTION] toggle id:', rawId, '=>', id, typeof id);

  if (!Number.isInteger(id)) {
    throw new Error('Invalid ID');
  }

  await toggleTodo({ id });
  revalidatePath('/');
}

export async function updateTodoAction(formData) {
  const id = Number(formData.get('id'));
  const title = formData.get('title')?.toString().trim();

  if (!id || !title) throw new Error('Invalid input');

  await updateTodo({ id, title });

  revalidatePath(`/todos/${id}`);
  revalidatePath('/todos');
}

export async function deleteTodoFromDetail(formData) {
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Invalid ID');

  await deleteTodo({ id });
  revalidatePath('/todos');
  redirect('/todos');
}






