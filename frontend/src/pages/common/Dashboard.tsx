import { useState, useMemo } from "react";
import { Plus, FileDown } from "lucide-react";
import { LeadStatsWidget } from "../../components/helpers/LeadStatsWidget";
import { FilterAndSearch } from "../../components/helpers/FilterAndSearch";
import { FilterModal } from "../../components/helpers/FilterModal";
import { CreateLeadModal } from "../../components/helpers/CreateLeadModal";
import { KanbanBoard } from "../../components/helpers/KanbanBoard";
import { LeadDetailsDrawer } from "../../components/helpers/LeadDetailsDrawer";
import { Button } from "../../components/ui/button";
import { type Role } from "../../constants/roles";
import type { Lead } from "../../components/helpers/LeadCard";

interface DashboardProps {
  role: Role;
}

export function Dashboard({ role }: DashboardProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [leadDrawerOpen, setLeadDrawerOpen] = useState(false);

  // Mock leads data - replace with actual API call
  const [leads, setLeads] = useState<Record<string, Lead[]>>({
    prime: [
      {
        id: "P10001",
        subject: "Prime: Enterprise CRM implementation for EU region",
        name: "Alice Johnson",
        company: "GlobalSoft",
        assignee: "Rahul Sharma",
        date: "05-01-2026",
        lastCommented: "04-01-2026",
        commentCount: 3,
        status: "prime",
        leadQuality: "LQ"
      },
      {
        id: "P10002",
        subject: "Prime: Multi-year support contract discussion",
        name: "David Miller",
        company: "BlueStone Corp",
        assignee: "Simran Kaur",
        date: "06-01-2026",
        lastCommented: null,
        commentCount: 1,
        status: "prime"
      }
    ],
    hot: [
      {
        id: "H29889",
        subject: "Hot: We Are Seeking To Partner With Established Software Dev...",
        name: "Rahul",
        company: "Rsisolution",
        assignee: "Amandeep Arora",
        date: "23-01-2026",
        lastCommented: null,
        commentCount: 0,
        status: "hot",
        leadQuality: "LQ"
      },
      {
        id: "H29890",
        subject: "Hot: We Are Looking For Partners Who Provide Us Bench Resources.",
        name: "Anshika Vashishtha",
        company: "Innovationm",
        assignee: "Pavitarta",
        date: "23-01-2026",
        lastCommented: null,
        commentCount: 0,
        status: "hot"
      },
      {
        id: "H29891",
        subject: "Hot: Custom product development for fintech platform",
        name: "Saurabh Jain",
        company: "FinTech Hub",
        assignee: "Mohit Verma",
        date: "24-01-2026",
        lastCommented: "24-01-2026",
        commentCount: 4,
        status: "hot"
      },
      {
        id: "H29892",
        subject: "Hot: Dedicated team requirement for US client",
        name: "Alex Brown",
        company: "Nova Systems",
        assignee: "Amandeep Arora",
        date: "25-01-2026",
        lastCommented: null,
        commentCount: 2,
        status: "hot"
      },
      {
        id: "H29893",
        subject: "Hot: Migration from legacy CRM to LeadsPortal",
        name: "Neha Kapoor",
        company: "FutureDesk",
        assignee: "Rahul",
        date: "26-01-2026",
        lastCommented: null,
        commentCount: 1,
        status: "hot"
      }
    ],
    warm: [
      {
        id: "W20001",
        subject: "Warm: Exploring outsourcing partnership for QA services",
        name: "Priya Singh",
        company: "QualityFirst",
        assignee: "Karan",
        date: "10-01-2026",
        lastCommented: null,
        commentCount: 0,
        status: "warm"
      },
      {
        id: "W20002",
        subject: "Warm: Mobile app revamp discussion",
        name: "John Doe",
        company: "AppSquare",
        assignee: "Pavitarta",
        date: "11-01-2026",
        lastCommented: "12-01-2026",
        commentCount: 2,
        status: "warm"
      },
      {
        id: "W20003",
        subject: "Warm: Offshore design team requirement",
        name: "Lisa Ray",
        company: "DesignPro",
        assignee: "Simran",
        date: "13-01-2026",
        lastCommented: null,
        commentCount: 1,
        status: "warm"
      }
    ],
    partner: [
      {
        id: "PR30001",
        subject: "Partner: Strategic long-term engagement for DevOps services",
        name: "Marko Baric",
        company: "Elektrik.Dev",
        assignee: "Gary",
        date: "04-01-2026",
        lastCommented: null,
        commentCount: 0,
        status: "partner",
        leadQuality: "LQ"
      },
      {
        id: "PR30002",
        subject: "Partner: Co-selling opportunity in APAC region",
        name: "Sophia Lee",
        company: "CloudBridge",
        assignee: "Rahul",
        date: "08-01-2026",
        lastCommented: "09-01-2026",
        commentCount: 3,
        status: "partner"
      },
      {
        id: "PR30003",
        subject: "Partner: Joint webinar on AI & Automation",
        name: "James Wilson",
        company: "AutoEdge",
        assignee: "Karan",
        date: "09-01-2026",
        lastCommented: null,
        commentCount: 1,
        status: "partner"
      }
    ],
    awarded: [
      {
        id: "A40001",
        subject: "Awarded: CRM implementation for retail chain",
        name: "Rohan Mehta",
        company: "RetailHub",
        assignee: "Simran",
        date: "02-01-2026",
        lastCommented: "03-01-2026",
        commentCount: 5,
        status: "awarded"
      },
      {
        id: "A40002",
        subject: "Awarded: Dedicated development team for SaaS product",
        name: "Emily Clark",
        company: "SaaSify",
        assignee: "Rahul",
        date: "07-01-2026",
        lastCommented: null,
        commentCount: 2,
        status: "awarded"
      }
    ],
    cold: [
      {
        id: "C50001",
        subject: "Cold: Initial outreach for web redesign",
        name: "Michael Scott",
        company: "PaperTech",
        assignee: "Pavitarta",
        date: "01-01-2026",
        lastCommented: null,
        commentCount: 0,
        status: "cold"
      },
      {
        id: "C50002",
        subject: "Cold: Lead from old campaign - no recent activity",
        name: "Angela White",
        company: "LegacySoft",
        assignee: "Karan",
        date: "15-12-2025",
        lastCommented: null,
        commentCount: 0,
        status: "cold"
      },
      {
        id: "C50003",
        subject: "Cold: Unresponsive after proposal sent",
        name: "Tom Hardy",
        company: "NextGen Solutions",
        assignee: "Simran",
        date: "20-12-2025",
        lastCommented: "22-12-2025",
        commentCount: 1,
        status: "cold"
      }
    ]
  });

  // Mock data - replace with actual API call (can be role-specific)
  const getLeadStats = () => {
    const statsByRole = {
      superadmin: {
        all: 1250,
        primeProspects: 150,
        partner: 80,
        awarded: 120,
        delayed: 90,
        warm: 320,
        cold: 450,
        hot: 180
      },
      admin: {
        all: 850,
        primeProspects: 100,
        partner: 50,
        awarded: 80,
        delayed: 60,
        warm: 220,
        cold: 300,
        hot: 150
      },
      assignee: {
        all: 120,
        primeProspects: 15,
        partner: 8,
        awarded: 12,
        delayed: 10,
        warm: 35,
        cold: 45,
        hot: 25
      }
    };
    return statsByRole[role as keyof typeof statsByRole] || statsByRole.assignee;
  };

  const leadStats = getLeadStats();

  const getPlaceholder = () => {
    const placeholders = {
      superadmin: "Search leads, users, or organizations...",
      admin: "Search leads, users, or teams...",
      assignee: "Search your leads..."
    };
    return placeholders[role as keyof typeof placeholders] || "Search...";
  };

  const getContentTitle = () => {
    const titles = {
      superadmin: "Recent Activity",
      admin: "Team Performance",
      assignee: "My Tasks"
    };
    return titles[role as keyof typeof titles] || "Recent Activity";
  };

  const getContentSubtitle = () => {
    const subtitles = {
      superadmin: "Pipeline Overview",
      admin: "Pipeline Overview",
      assignee: "Recent Activities"
    };
    return subtitles[role as keyof typeof subtitles] || "Overview";
  };

  const handleFilterApply = (filters: any) => {
    console.log("Applied filters:", filters);
    // TODO: Apply filters to lead data
  };

  const handleFilterReset = () => {
    console.log("Filters reset");
    // TODO: Reset lead data filters
  };

  const handleCreateLead = (data: any) => {
    console.log("Create lead:", data);
    // TODO: Submit lead creation to API
    // For now, add to appropriate status column based on data.status
    const newLead: Lead = {
      id: `L${Date.now()}`,
      subject: data.message.substring(0, 50) + "...",
      name: data.clientName,
      company: data.companyName,
      assignee: data.leadOwnership || "Unassigned",
      date: new Date().toLocaleDateString("en-GB"),
      lastCommented: null,
      commentCount: 0,
      status: (data.status.toLowerCase() as Lead["status"]) || "cold"
    };

    setLeads(prev => ({
      ...prev,
      [newLead.status]: [...(prev[newLead.status] || []), newLead]
    }));
  };

  const handleLeadMove = (leadId: string, fromStatus: string, toStatus: string) => {
    setLeads(prev => {
      const fromLeads = prev[fromStatus] || [];
      const toLeads = prev[toStatus] || [];
      const lead = fromLeads.find(l => l.id === leadId);

      if (!lead) return prev;

      const updatedLead = { ...lead, status: toStatus as Lead["status"] };

      return {
        ...prev,
        [fromStatus]: fromLeads.filter(l => l.id !== leadId),
        [toStatus]: [...toLeads, updatedLead]
      };
    });

    // TODO: Call API to update lead status
    console.log(`Moved lead ${leadId} from ${fromStatus} to ${toStatus}`);
  };

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    if (!searchValue.trim()) return leads;

    const searchLower = searchValue.toLowerCase();
    const filtered: Record<string, Lead[]> = {};

    Object.keys(leads).forEach(status => {
      filtered[status] = leads[status].filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.subject.toLowerCase().includes(searchLower) ||
        lead.assignee.toLowerCase().includes(searchLower)
      );
    });

    return filtered;
  }, [leads, searchValue]);

  const handleLeadClick = (lead: Lead) => {
    setActiveLead(lead);
    setLeadDrawerOpen(true);
  };

  const handleExportCsv = () => {
    const allLeads: Lead[] = Object.values(filteredLeads).flat();
    if (allLeads.length === 0) {
      console.warn("No leads available to export");
      return;
    }

    const headers = [
      "ID",
      "Subject",
      "Name",
      "Company",
      "Assignee",
      "Date",
      "Last Commented",
      "Comment Count",
      "Status",
      "Lead Quality"
    ];

    const escapeValue = (value: unknown) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = allLeads.map(lead => [
      escapeValue(lead.id),
      escapeValue(lead.subject),
      escapeValue(lead.name),
      escapeValue(lead.company),
      escapeValue(lead.assignee),
      escapeValue(lead.date),
      escapeValue(lead.lastCommented),
      escapeValue(lead.commentCount ?? 0),
      escapeValue(lead.status),
      escapeValue((lead as any).leadQuality ?? "")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const currentYear = new Date().getFullYear();
    link.href = url;
    link.download = `leads-${selectedMonth.toLowerCase()}-${currentYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0 py-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 w-full min-w-0">
        <div className="flex-1 min-w-0">
          <FilterAndSearch
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onFilterClick={() => setFilterModalOpen(true)}
            placeholder={getPlaceholder()}
          />
        </div>
        <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleExportCsv}
            className="flex-1 sm:flex-none flex items-center gap-2 whitespace-nowrap justify-center border border-slate-200/90 dark:border-[#22252e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#181a22] shadow-sm font-medium"
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => setCreateLeadModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center gap-2 whitespace-nowrap flex-shrink-0 justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4" />
            Create Lead
          </Button>
        </div>
      </div>

      <LeadStatsWidget stats={leadStats} />

      {/* Kanban Board */}
      <KanbanBoard
        leads={filteredLeads}
        onLeadMove={handleLeadMove}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onLeadClick={handleLeadClick}
      />

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />

      {/* Create Lead Modal */}
      <CreateLeadModal
        open={createLeadModalOpen}
        onOpenChange={setCreateLeadModalOpen}
        onSubmit={handleCreateLead}
      />

      {/* Lead details drawer */}
      <LeadDetailsDrawer
        open={leadDrawerOpen}
        lead={activeLead}
        onClose={() => setLeadDrawerOpen(false)}
      />
    </div>
  );
}
