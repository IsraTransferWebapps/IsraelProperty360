import { supabase } from './supabaseClient';

export const Core = {
  SendEmail: async ({ to, subject, body }) => {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send email');
    return data;
  },

  UploadFile: async ({ file }) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return { file_url: publicUrl };
  },

  InvokeLLM: async () => {
    throw new Error('LLM integration not configured');
  },
  GenerateImage: async () => {
    throw new Error('Image generation not configured');
  },
  ExtractDataFromUploadedFile: async () => {
    throw new Error('File extraction not configured');
  },
  SendSMS: async () => {
    throw new Error('SMS not configured');
  },
};

export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const InvokeLLM = Core.InvokeLLM;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const SendSMS = Core.SendSMS;
