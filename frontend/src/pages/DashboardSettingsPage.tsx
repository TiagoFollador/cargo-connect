import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const DashboardSettingsPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const handleSaveNotifications = () => {
    toast({
      title: 'Preferências de notificação atualizadas',
      description: 'Suas configurações de notificação foram salvas.',
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: 'Senha atualizada',
      description: 'Sua senha foi alterada com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e preferências da sua conta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Atualize os detalhes da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue={currentUser?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Endereço de Email</Label>
                <Input id="email" type="email" defaultValue={currentUser?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input id="phone" placeholder="(11) 98765-4321" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (Opcional)</Label>
                <Input id="company" placeholder="Nome da sua empresa" />
              </div>
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>
              Configure como deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notificações por Email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receba atualizações e alertas por email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notificações por SMS</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receba alertas importantes por mensagem de texto
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </div>
            <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Atualize sua senha para manter sua conta segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button onClick={handleSavePassword}>Atualizar Senha</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;

