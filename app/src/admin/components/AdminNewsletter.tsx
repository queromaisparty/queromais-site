import { useData } from '@/context/DataContext';
import { Mail, Download, CheckCircle, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

export function AdminNewsletter() {
  const { newsletterSubscribers } = useData();

  const handleExportCSV = () => {
    if (newsletterSubscribers.length === 0) {
      toast.error('Nenhum inscrito para exportar.');
      return;
    }

    const csvContent = [
      ['Data de Cadastro', 'E-mail', 'Status'].join(','),
      ...newsletterSubscribers.map(sub => [
        new Date(sub.createdAt).toLocaleDateString(),
        sub.email,
        sub.active ? 'Ativo' : 'Inativo'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_queromais_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Lista exportada com sucesso!');
  };

  const activeCount = newsletterSubscribers.filter(s => s.active).length;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assinantes da Newsletter</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Gerencie e exporte os e-mails capturados através do rodapé do site.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-admin-accent hover:brightness-110 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
        >
          <Download className="w-5 h-5" /> Baixar Planilha CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-pink-50 text-admin-accent flex items-center justify-center shrink-0 border border-pink-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Total de Inscritos</p>
            <p className="text-3xl font-bold text-slate-900">{newsletterSubscribers.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-0.5">E-mails Ativos</p>
            <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data de Inscrição</th>
                <th className="px-6 py-4">Endereço de E-mail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsletterSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Nenhum e-mail capturado ainda.</p>
                  </td>
                </tr>
              ) : (
                [...newsletterSubscribers].sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {sub.active ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{sub.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
