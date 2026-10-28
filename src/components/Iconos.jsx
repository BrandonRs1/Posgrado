// Iconos modernos y consistentes impulsados por Lucide React
import {
  Home,
  GraduationCap,
  ClipboardCheck,
  ListChecks,
  BarChart3,
  Settings,
  FolderOpen,
  BookOpen,
  Sun,
  Moon,
  LogOut,
  Inbox,
  Megaphone,
  Check,
  Bell,
} from "lucide-react";

// Envoltorio para mantener compatibilidad total con estilos y props existentes
const createIcon = (LucideIcon) => {
  const Component = ({ size = 20, strokeWidth = 1.8, className = "icono", ...props }) => (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
  Component.displayName = LucideIcon.displayName || LucideIcon.name;
  return Component;
};

// Iconos mapeados exactamente a las secciones y componentes del sistema
export const IconInicio = createIcon(Home);
export const IconProgramas = createIcon(GraduationCap);
export const IconEvaluaciones = createIcon(ClipboardCheck);
export const IconCriterios = createIcon(ListChecks);
export const IconReportes = createIcon(BarChart3);
export const IconConfiguracion = createIcon(Settings);
export const IconExpediente = createIcon(FolderOpen);
export const IconCursos = createIcon(BookOpen);
export const IconSol = createIcon(Sun);
export const IconLuna = createIcon(Moon);
export const IconSalir = createIcon(LogOut);
export const IconBuzon = createIcon(Inbox);
export const IconAnuncio = createIcon(Megaphone);
export const IconCheck = createIcon(Check);
export const IconCampana = createIcon(Bell);

// Re-exportamos Lucide React para que cualquier componente pueda importar iconos adicionales
export * from "lucide-react";
