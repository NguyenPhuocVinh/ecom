// src/components/Login.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface LoginProps {
    onLogin: (status: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { loading, error: apiError, fetchApi } = useApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetchApi<{ accessToken: string; refreshToken: string }>(
                '/auth/login',
                'post',
                { email, password }
            );
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            onLogin(true);
            toast.success('Đăng nhập thành công', {
                description: 'Chào mừng đến với Admin Dashboard',
            });
            navigate('/admin');
        } catch (err) {
            const errorMessage = (err as Error).message || 'Đăng nhập thất bại';
            setError(errorMessage);
            toast.error('Lỗi đăng nhập', {
                description: errorMessage,
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen w-screen bg-background text-foreground"
            style={{
                backgroundImage: `url('/src/assets/Milky-Way-4K-Wallpaper-512023.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Card className="w-full max-w-md mx-auto p-4 shadow-lg backdrop-blur-sm">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Đăng nhập Admin</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="text-card-foreground"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="text-card-foreground border-border pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-card-foreground text-lg border-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        {(error || apiError) && (
                            <p className="text-destructive text-sm">{error || apiError}</p>
                        )}
                        {loading && <p className="text-muted-foreground text-sm">Đang xử lý...</p>}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-auto text-primary-foreground bg-neutral-600/60 hover:bg-neutral-600/50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
