# Proposal: Visual CA Design Tool for PKIaaS Onboarding

**To:** [Boss's Name]

**From:** [Your Name]

**Date:** 6 April 2025

**Subject:** Improving PKIaaS Onboarding with a Visual Design Tool

---

## Problem

Our current PKIaaS onboarding requires clients to manually specify CA hierarchies. This is often complex for them, leading to back-and-forth, delays, and setup errors, increasing our support workload.

## Solution: Interactive Visual CA Designer

Integrate a web-based visual tool into onboarding. Clients can:

1.  **Visually Design:** Drag-and-drop CAs (Root, Intermediate) and define relationships (signing, cross-signing) using templates or from scratch.
2.  **Configure:** Set basic CA properties in the tool.
3.  **Validate (Future):** Add rules to check the design against best practices/platform limits.
4.  **Export JSON:** Generate a standardised JSON file representing their designed hierarchy.
5.  **Automate Provisioning:** Use the exported JSON as direct input for our backend to automate PKI setup.

## Benefits

*   **Better Client Experience:** Simpler, more intuitive way for clients to design their PKI.
*   **Fewer Errors:** Reduces misconfigurations from manual specs, cutting down support requests.
*   **More Efficient:** Automates translating client needs into config, saving our team time.
*   **Quicker Setup:** Clients get their PKI running faster.
*   **Competitive Edge:** Modern, user-friendly onboarding differentiates our service.

## Next Steps

We have a prototype showing the visualisation. Recommend we enhance it with:

1.  Full editing features (add/remove nodes, define relationships).
2.  Refined JSON export matching our provisioning API.
3.  Integration into the client onboarding portal.

This tool can significantly improve a key part of our service. Happy to demo and discuss further.