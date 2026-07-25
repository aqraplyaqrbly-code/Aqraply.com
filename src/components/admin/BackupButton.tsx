import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Download, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BackupButton() {
  const [isExporting, setIsExporting] = useState(false);
  
  // Use the exportAll query directly
  const exportData = useQuery(api.exportAll.exportAllData);

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    
    try {
      // Wait for fresh data
      if (!exportData) {
        throw new Error("Failed to export data");
      }
      
      // Create JSON file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `aqraply-backup-${timestamp}.json`;
      
      // Download file
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const totalRecords = Object.values(exportData.data).reduce((sum: number, arr: any) => sum + arr.length, 0);
      const tableCount = Object.keys(exportData.data).length;
      
      toast.success(`Backup downloaded successfully! ${tableCount} tables, ${totalRecords} records`);
    } catch (error) {
      console.error("Backup error:", error);
      toast.error("Failed to download backup. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleDownloadBackup}
      disabled={isExporting || !exportData}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : !exportData ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <Database className="w-4 h-4" />
          <Download className="w-4 h-4" />
          <span>Download Backup</span>
        </>
      )}
    </button>
  );
}
