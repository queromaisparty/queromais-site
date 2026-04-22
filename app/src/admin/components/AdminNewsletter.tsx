import { useData } from '@/context/DataContext';
import { Mail, Download, CheckCircle, XCircle } from 'lucide-react';
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

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Newsletter</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Gerencie e exporte os e-mails capturados no site.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-admin-accent text-white font-bold rounded-lg hover:bg-admin-accent-dark transition-colors shadow-sm"
        >
          <Download className="w-5 h-5" /> Exportar para CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-admin-accent flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Inscritos</p>
            <p className="text-2xl font-bold text-black">{newsletterSubscribers.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-[#F9FAFB] border-b border-gray-200 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data de Inscrição</th>
              <th className="px-6 py-4">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {newsletterSubscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">Nenhum e-mail capturado ainda.</td>
              </tr>
            ) : (
              [...newsletterSubscribers].sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(sub => (
                <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {sub.active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle className="w-3 h-3"/> Ativo</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold"><XCircle className="w-3 h-3"/> Inativo</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-black">{sub.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
