# Guia de Deploy - Vercel

## 📋 Pré-requisitos

- ✅ Código já está pronto
- ✅ Supabase já configurado
- ⬜ Conta no GitHub
- ⬜ Conta na Vercel

---

## 🚀 Passo a Passo

### **1. Criar Repositório no GitHub**

1. Vá em https://github.com/new
2. Nome do repositório: `user-management-system` (ou outro nome)
3. **Deixe PRIVADO** (tem credenciais no histórico)
4. **NÃO** inicialize com README
5. Clique em "Create repository"

### **2. Fazer Push do Código**

No terminal, execute:

```bash
# Adicionar remote do GitHub (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/user-management-system.git

# Verificar se há mudanças para commitar
git status

# Adicionar todos os arquivos
git add .

# Criar commit
git commit -m "Initial commit - User Management System"

# Enviar para GitHub
git push -u origin main
```

**⚠️ IMPORTANTE:** Se pedir login:
- Username: seu username do GitHub
- Password: use um **Personal Access Token** (não sua senha)
  - Gere em: https://github.com/settings/tokens

### **3. Deploy na Vercel**

1. Vá em https://vercel.com
2. Clique em "Add New" > "Project"
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Next.js (detecta automaticamente)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### **4. Configurar Variáveis de Ambiente na Vercel**

**CRÍTICO:** Adicione as mesmas variáveis do `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cjnwewurzkhyeppuvnco.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjU4NTgsImV4cCI6MjA3Njc0MTg1OH0.m2q9U1BpbY8dlR_h2-14MIwcvxlIiL8f_7rD7bS5fdY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE2NTg1OCwiZXhwIjoyMDc2NzQxODU4fQ.DX7Wqn3RTNgIjIbWNp4Qj5TVNlDzyXR_vVOPGRacJgA
NEXT_PUBLIC_URL=https://seu-projeto.vercel.app
```

**Como adicionar na Vercel:**
1. No projeto, vá em "Settings" > "Environment Variables"
2. Adicione cada variável (uma por vez)
3. Marque: **Production**, **Preview**, **Development**

### **5. Atualizar Configurações no Supabase**

Após o deploy, a Vercel vai te dar uma URL tipo: `https://user-management-system.vercel.app`

Vá no **Supabase Dashboard** e configure:

#### **Authentication > URL Configuration:**

- **Site URL**: `https://user-management-system.vercel.app`
- **Redirect URLs**: Adicione:
  ```
  https://user-management-system.vercel.app/auth/callback
  https://user-management-system.vercel.app/verify-email
  http://localhost:3000/auth/callback
  http://localhost:3000/verify-email
  ```

#### **Authentication > Email Templates:**

Troque todos os links de `{{ .ConfirmationURL }}` para apontar para a URL da Vercel.

### **6. Deploy!**

Clique em **"Deploy"** na Vercel.

O build vai levar uns 2-3 minutos. Depois:

✅ Seu site estará no ar!
✅ Emails de verificação vão funcionar!
✅ SSL automático (HTTPS)

---

## 🔄 Atualizações Futuras

Toda vez que você fizer `git push`, a Vercel vai fazer deploy automático!

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

---

## ⚠️ Problemas Comuns

### Build falhou na Vercel

**Erro:** "Environment validation failed"

**Solução:** Verifique se todas as variáveis de ambiente foram adicionadas corretamente na Vercel.

### Email de verificação não funciona

**Solução:** Verifique as Redirect URLs no Supabase.

### Erro 404 em algumas páginas

**Solução:** Certifique-se de que está usando Next.js App Router (não Pages Router).

---

## 📊 Próximos Passos Opcionais

1. **Custom Domain**: Adicionar domínio próprio na Vercel
2. **Sentry**: Configurar monitoramento de erros
3. **Analytics**: Adicionar Vercel Analytics
4. **Edge Functions**: Otimizar para Edge Runtime

---

## 🆘 Precisa de Ajuda?

- Documentação Vercel: https://vercel.com/docs
- Documentação Supabase: https://supabase.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Boa sorte! 🚀**
