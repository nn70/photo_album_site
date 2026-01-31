
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { handleCreateAlbum } from "@/app/actions/albumActions";

const ALLOWED_EMAILS = [
    "nn70nn70@gmail.com",
    "hortonchang@gmail.com",
    "raeniechang@gmail.com"
];

export default async function AdminPage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    const userEmail = session.user?.email;

    if (!userEmail || !ALLOWED_EMAILS.includes(userEmail)) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: 'red' }}>存取被拒 (Access Denied)</h1>
                <p>您的帳號 ({userEmail}) 沒有權限進入管理後台。</p>
                <Link href="/">返回首頁</Link>
            </main>
        );
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return (
        <main style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h1>管理後台</h1>
            <div style={{ marginBottom: '20px', padding: '15px', background: '#e0f7fa', borderRadius: '8px' }}>
                <strong>目前的自動化設定：</strong> 系統會在每個月有人訪問首頁時，自動檢查並建立該當月的新相簿（如果還沒建立的話）。
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
                <h3>手動建立相簿</h3>
                <form action={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label>
                            年份: <input name="year" type="number" defaultValue={currentYear} style={{ padding: '5px' }} />
                        </label>
                        <label>
                            月份: <input name="month" type="number" defaultValue={currentMonth} style={{ padding: '5px' }} />
                        </label>
                    </div>

                    <label>
                        連結 (Google Photos Link):
                        <input name="link" type="text" placeholder="https://..." style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                    </label>

                    <label>
                        自訂標題 (選填, 預設會自動計算年齡):
                        <input name="title" type="text" placeholder="例如: 2026年3月-9Y8M" style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
                    </label>

                    <button type="submit" style={{
                        padding: '10px',
                        background: '#1a73e8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        建立相簿
                    </button>
                </form>
            </div>
        </main>
    );
}
