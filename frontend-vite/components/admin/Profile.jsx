export default function Profile() {
    const profile = {
        name: "John Doe",
        role: "HR Manager",
        email: "john.doe@hireco.com",
        phone: "+62 812-3456-7890",
        avatar: "https://avatar.iran.liara.run/public/49",
        joined: "January 2022",
    };
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            <div className="bg-white p-8 rounded-lg shadow">
                <div className="flex flex-col items-center mb-6">
                    <img src={profile.avatar} alt="Profile" className="w-20 h-20 rounded-full mb-4" />
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-gray-600">{profile.role}</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1">{profile.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="mt-1">{profile.phone}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Member Since</label>
                        <p className="mt-1">{profile.joined}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}