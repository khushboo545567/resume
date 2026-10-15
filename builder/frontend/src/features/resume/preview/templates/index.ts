import TechnicalDeveloperTemplate from "./TechnicalDeveloperTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import StudentTemplate from "./StudentTemplate";
import AtsTemplate from "./AtsTemplate";
import SplitLabelTemplate from "./SplitLabelTemplate";
import CorporateBandTemplate from "./CorporateBandTemplate";
import ClassicSerifTemplate from "./ClassicSerifTemplate";
import CorporateClassicTemplate from "./CorporateClassicTemplate";
import ExecutiveBlueTemplate from "./ExecutiveBlueTemplate";
import ProfessionalModernTemplate from "./ProfessionalModernTemplate";
import ModernProfessionalTemplate from "../../templates/modern-professional/ModernProfessionalTemplate";
import EnhancvModernTemplate from "../../templates/enhancv-modern/EnhancvModernTemplate";
import HarvardATSTemplate from "../../templates/harvard-ats/HarvardATSTemplate";
import LatexAtsTemplate from "../../templates/latex-ats/LatexAtsTemplate";
import LatexAtsPhotoTemplate from "../../templates/latex-ats-photo/LatexAtsPhotoTemplate";
import LatexAtsV2Template from "../../templates/latex-ats-v2/LatexAtsV2Template";
import ExecutiveSidebarTemplate from "../../templates/executive-sidebar/ExecutiveSidebarTemplate";
import LatexSidebarTemplate from "../../templates/latex-sidebar/LatexSidebarTemplate";

export const ResumeTemplatesMap = {
  "technical-developer": TechnicalDeveloperTemplate,
  "modern-professional": ModernProfessionalTemplate,
  "professional-modern": ProfessionalModernTemplate,
  "minimal-clean": MinimalTemplate,
  "corporate-band": CorporateBandTemplate,
  "split-label": SplitLabelTemplate,
  "classic-serif": ClassicSerifTemplate,
  "corporate-classic": CorporateClassicTemplate,
  "executive-blue": ExecutiveBlueTemplate,
  "enhancv-modern": EnhancvModernTemplate,
  "harvard-ats": HarvardATSTemplate,
  "latex-ats": LatexAtsTemplate,
  "latex-ats-photo": LatexAtsPhotoTemplate,
  "latex-ats-v2": LatexAtsV2Template,
  "executive-sidebar": ExecutiveSidebarTemplate,
  "latex-sidebar": LatexSidebarTemplate,

  executive: ExecutiveTemplate,
  student: StudentTemplate,
  ats: AtsTemplate,
};
