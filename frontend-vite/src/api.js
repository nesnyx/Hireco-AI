import axios from "axios";



const BASE_URL = "https://api-hireco.nadinata.org";

export async function loginHandler({ email, password }) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, { email: email, password: password });
        console.log(response.data)
        const data = response.data;

        // Simpan token di cookies (7 hari)
        localStorage.setItem("token", data.token);

        return {
            msg: "success",
            status: true,
            token: data.token
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}

export async function registerHandler({ email, password, fullName }) {
    try {
        await axios.post(`${BASE_URL}/auth/register`, { email: email, password: password, full_name: fullName});
        return {
            msg: "success",
            status: true,
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}


export async function registerAdminHandler({ email, password, fullName }) {
    try {
        await axios.post(`${BASE_URL}/auth/register`, { email: email, password: password, full_name: fullName});
        return {
            msg: "success",
            status: true,
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}


export async function getApplicantByHR() {
    try {
        const response = await axios.get(`${BASE_URL}/applicant/get-by-hr`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });
        const data = response.data;
        return {
            msg: "success",
            status: true,
            result: data.data
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}


export async function logoutHandler() {
    return localStorage.removeItem("token");
}


export async function createJob({ title, position, description, criteria }) {
    try {
        const response = await axios.post(`${BASE_URL}/hr/jobs/create`, { title, position, description, criteria }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`
            }
        })
        const data = response.data;
        return {
            msg: "success",
            status: true,
            data: data
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}


export async function getJobByHr() {
    try {
        const response = await axios.get(`${BASE_URL}/hr/jobs/get-by-hr`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`
            }
        })
        const data = response.data;
        return {
            msg: "success",
            status: true,
            result: data.data
        };
    } catch (error) {
        console.error("Get Jobs error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}

export async function deleteJob(job_id) {
    try {
        await axios.delete(`${BASE_URL}/hr/jobs/${job_id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`
            }
        })

        return {
            msg: "success",
            status: true,
            result: "",
        };
    } catch (error) {
        console.error("Get Jobs error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}

export async function updateJob({ job_id, title, position, description, criteria }) {
    try {
        await axios.put(`${BASE_URL}/hr/jobs/${job_id}`, { title, position, description, criteria }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`
            }
        })
        return {
            msg: "success",
            status: true,
            result: "",
        }
    } catch (error) {
        console.error("Get Jobs error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}

export async function getAllJobs() {
    try {
        const response = await axios.get(`${BASE_URL}/hr/jobs`)
        const data = response.data;
        return {
            msg: "success",
            status: true,
            result: data.data
        };
    } catch (error) {
        console.error("Get Jobs error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}


export async function applyJob(formData) {
    try {
        const response = await axios.post(`${BASE_URL}/applicant/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // opsional (axios biasanya set otomatis)
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}


export async function uploadMultipleResumes(formData) {
    try {
        const response = await axios.post(`${BASE_URL}/applicant/upload/batch`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // opsional (axios biasanya set otomatis)
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}


export async function downloadPDF(filename) {
    try {
        const response = await axios.get(`${BASE_URL}/hr/download/${filename}`, {
            responseType: 'blob' // penting agar axios handle PDF sebagai blob
        });

        // Buat URL blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Buat link download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // nama file saat download
        document.body.appendChild(link);
        link.click();

        // Bersihkan
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading file:", error);
    }
}


export async function getUserMe() {
    try {
        const response = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/admin/login'
        }
        console.error("Error fetching user:", error);
        throw error;
    }
}


export async function deleteApplicantByID(id) {
    try {
        await axios.delete(`${BASE_URL}/applicant/delete/${id}`)
        return {
            msg: "success",
            status: true,
            result: "",
        };
    } catch (error) {
        console.error("Get Jobs error:", error);
        return {
            msg: "Something went wrong",
            status: false
        };
    }
}