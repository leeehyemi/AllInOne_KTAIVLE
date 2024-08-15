import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'https://allinone-spring.com/admin/notices';

class NoticeService {
    getNotices() {
        return axios.get(API_URL);
    }

    createNotice(notice) {
        return axios.post(API_URL, notice);
    }

    updateNotice(id, notice) {
        return axios.put(`${API_URL}/${id}`, notice);
    }

    deleteNotice(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    getNoticeById(id) {
        return axios.get(`${API_URL}/${id}`);
    }
}

export default new NoticeService();
