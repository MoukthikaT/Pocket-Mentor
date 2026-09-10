import api from './api';

export const getLearningOverview = () => api.get('/learning/overview').then(({ data }) => data);
export const saveProfile = (profile) => api.put('/learning/profile', profile).then(({ data }) => data);
export const submitTeaching = (payload) => api.post('/learning/teaching', payload).then(({ data }) => data);
export const submitBossAnswer = (payload) => api.post('/learning/boss', payload).then(({ data }) => data);
export const startRescue = (payload) => api.post('/learning/rescue', payload).then(({ data }) => data);
export const saveQuizRecord = (payload) => api.post('/learning/quiz', payload).then(({ data }) => data);
export const fixMistake = (payload) => api.post('/learning/mistakes/fix', payload).then(({ data }) => data);
