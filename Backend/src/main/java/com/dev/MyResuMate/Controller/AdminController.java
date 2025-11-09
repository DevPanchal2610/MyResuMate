package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.AdminDashboardDTO;
import com.dev.MyResuMate.Model.*;
import com.dev.MyResuMate.Service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/admin") // All methods in this class will start with /admin
public class AdminController {

    // 1. Inject all your admin-related services
    @Autowired private AdminDashboardService dashboardService;
    @Autowired private AdminUserService userService;
    @Autowired private AdminTemplateService templateService;
    @Autowired private AdminContactService contactService;
    @Autowired private AdminUserSubscriptionService userSubscriptionService;
    @Autowired private AdminSubscriptionPlanService subscriptionPlanService;
    @Autowired private PdfService pdfService;

    /**
     * Handles the Dashboard page
     * GET /admin/dashboard
     */
    @GetMapping("/dashboard")
    public String getDashboard(Model model, Authentication authentication, HttpServletRequest request,
                               @RequestParam(value = "range", defaultValue = "7d") String range) { // ✅ Add RequestParam

        String adminName = authentication.getName();

        // ✅ Get all stats from the service using the date range
        AdminDashboardDTO stats = dashboardService.getDashboardData(range);

        // ✅ Add all stats to the model for Thymeleaf
        model.addAttribute("adminName", adminName);

        // Range Stats
        model.addAttribute("totalRevenue", stats.getTotalRevenueForRange());
        model.addAttribute("newUsers", stats.getNewUsersForRange());
        model.addAttribute("newSubscriptions", stats.getNewSubscriptionsForRange());
        model.addAttribute("dateRangeLabel", stats.getDateRangeLabel());
        model.addAttribute("selectedRange", range);

        // All-Time Stats
        model.addAttribute("totalUsersAllTime", stats.getTotalUsersAllTime());
        model.addAttribute("activeSubscriptionsAllTime", stats.getActiveSubscriptionsAllTime());
        model.addAttribute("totalResumesAllTime", stats.getTotalResumesAllTime());

        // Tables
        model.addAttribute("recentUsers", stats.getRecentUsers());
        model.addAttribute("recentTransactions", stats.getRecentTransactions());

        // Chart
        model.addAttribute("chartLabels", stats.getChartLabels());
        model.addAttribute("chartData", stats.getChartData());

        model.addAttribute("pageUri", request.getRequestURI()); // For sidebar
        model.addAttribute("pageTitle", "Dashboard"); // For header
        return "admin/dashboard";
    }

    /**
     * Handles downloading the dashboard report as a PDF
     * GET /admin/dashboard/download-pdf
     */
    @GetMapping("/dashboard/download-pdf")
    public ResponseEntity<byte[]> downloadReportAsPdf(@RequestParam(value = "range", defaultValue = "7d") String range,
                                                      Authentication authentication) throws IOException {

        // 1. Get all the same data as the dashboard
        AdminDashboardDTO stats = dashboardService.getDashboardData(range);
        String adminName = authentication.getName();

        // 2. Create a Thymeleaf Context and add all the variables
        Context context = new Context();
        context.setVariable("adminName", adminName);
        context.setVariable("report", stats);
        // We pass the "all-time" stats separately for the PDF
        context.setVariable("totalUsersAllTime", stats.getTotalUsersAllTime());
        context.setVariable("activeSubscriptionsAllTime", stats.getActiveSubscriptionsAllTime());
        context.setVariable("totalResumesAllTime", stats.getTotalResumesAllTime());

        // 3. Generate the PDF using the new service and a new template file
        byte[] pdfBytes = pdfService.generatePdfFromHtml("admin/report-pdf", context);

        // 4. Create the file name (e.g., "MyResuMate_Report_Last_7_Days.pdf")
        String fileName = "MyResuMate_Report_" + stats.getDateRangeLabel().replace(" ", "_") + ".pdf";

        // 5. Return the PDF as a file download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    /**
     * Shows the form to edit a Subscription Plan
     * GET /admin/plans/edit/{id}
     */
    @GetMapping("/plans/edit/{id}")
    public String getEditPlanForm(@PathVariable Long id, Model model, HttpServletRequest request) {
        SubscriptionPlan plan = subscriptionPlanService.findById(id);

        model.addAttribute("plan", plan);
        model.addAttribute("pageTitle", "Edit Subscription Plan");
        // Set pageUri to keep the "Subscriptions" link active in the sidebar
        model.addAttribute("pageUri", "/admin/subscriptions");
        return "admin/plan-form"; // We will create this file next
    }

    /**
     * Saves the changes to a Subscription Plan
     * POST /admin/plans/save
     */
    @PostMapping("/plans/save")
    public RedirectView savePlan(@ModelAttribute SubscriptionPlan plan) {
        subscriptionPlanService.savePlan(plan);
        return new RedirectView("/admin/subscriptions");
    }

    /**
     * Handles the User Management page
     * GET /admin/users
     */
    @GetMapping("/users")
    public String getUserManagementPage(Model model, HttpServletRequest request) {
        List<User> userList = userService.getAllUsers();
        model.addAttribute("users", userList);

        model.addAttribute("pageUri", request.getRequestURI()); // For sidebar
        return "admin/users";
    }

    /**
     * Handles the Template Management page
     * GET /admin/templates
     */
    @GetMapping("/templates")
    public String getTemplateManagementPage(Model model, HttpServletRequest request) {
        List<ResumeTemplate> templates = templateService.getAllTemplates();
        model.addAttribute("templates", templates);

        model.addAttribute("pageUri", request.getRequestURI()); // For sidebar
        return "admin/templates";
    }

    /**
     * Handles the Subscriptions Management page
     * GET /admin/subscriptions
     */
    @GetMapping("/subscriptions")
    public String getSubscriptionManagementPage(Model model, HttpServletRequest request) {
        // Get data from BOTH services
        List<UserSubscription> userSubscriptions = userSubscriptionService.getAllSubscriptions();
        List<SubscriptionPlan> subscriptionPlans = subscriptionPlanService.getAllPlans();

        model.addAttribute("userSubscriptions", userSubscriptions);
        model.addAttribute("subscriptionPlans", subscriptionPlans);

        model.addAttribute("pageUri", request.getRequestURI());
        model.addAttribute("pageTitle", "Subscription Management"); // For the header
        return "admin/subscriptions";
    }
    /**
     * Handles the Contact Messages page
     * GET /admin/contact
     */
    @GetMapping("/contact")
    public String getContactMessagesPage(Model model, HttpServletRequest request) {
        List<ContactSubmission> submissions = contactService.getAllSubmissions();
        model.addAttribute("submissions", submissions);

        model.addAttribute("pageUri", request.getRequestURI()); // For sidebar
        return "admin/contact";
    }

    /**
     * Handles the "Add New Template" form
     * GET /admin/templates/new
     */
    @GetMapping("/templates/new")
    public String getNewTemplateForm(Model model, HttpServletRequest request) {
        model.addAttribute("template", new ResumeTemplate()); // Pass an empty object for the form
        model.addAttribute("pageTitle", "Add New Template");
        model.addAttribute("pageUri", request.getRequestURI());
        return "admin/template-form"; // This is the file we are about to create
    }

    /**
     * Handles the "Edit Template" form
     * GET /admin/templates/edit/{id}
     */
    @GetMapping("/templates/edit/{id}")
    public String getEditTemplateForm(@PathVariable Long id, Model model, HttpServletRequest request) {
        ResumeTemplate template = templateService.findById(id); // Find the existing template
        model.addAttribute("template", template); // Pass the found template to the form
        model.addAttribute("pageTitle", "Edit Template");
        model.addAttribute("pageUri", request.getRequestURI());
        return "admin/template-form";
    }

    /**
     * Handles the "Save" action for both Add and Edit
     * POST /admin/templates/save
     */
    @PostMapping("/templates/save")
    public RedirectView saveTemplate(@ModelAttribute ResumeTemplate template,
                                     @RequestParam("imageFile") MultipartFile imageFile) {

        // Pass both the form data and the file to the service
        templateService.saveTemplate(template, imageFile);

        return new RedirectView("/admin/templates");
    }

    /**
     * Handles the "Delete Template" action
     * POST /admin/templates/delete/{id}
     */
    @PostMapping("/templates/delete/{id}")
    public RedirectView deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        // Redirect back to the template list
        return new RedirectView("/admin/templates");
    }


}