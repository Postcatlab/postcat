import http from 'ky';
const URL = `http://apis.apikit.deveolink.com/api/v2/api_studio/management/api/importOpenApi`;

export const sync_to_remote = async (data, { projectId, SecretKey }) => {
  const formData = new FormData();
  formData.append(
    'file[]',
    new Blob([JSON.stringify(data)], {
      type: 'application/json',
    })
  );
  formData.append('project_id', projectId);
  formData.append('update_type', 'all');
  formData.append('api_status', '0');
  const response = await http
    .post(URL, {
      headers: {
        'Eo-Secret-Key': SecretKey,
      },
      body: formData,
    })
    .json();
  return response;
};
