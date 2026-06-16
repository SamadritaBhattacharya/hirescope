"""
Report builder — assembles FullReport from completed ResearchJobState.
Single Responsibility: one class, one job.
"""

from __future__ import annotations

from models.schemas import FullReport, ResearchJobState, RoleArchetype


class ReportBuilder:
    """Converts a completed ResearchJobState into the FullReport API response."""

    @staticmethod
    def build(state: ResearchJobState) -> FullReport:
        report = FullReport(
            job_id=state.job_id,
            status=state.status,
            created_at=state.created_at,
            completed_at=state.completed_at,
            errors=state.errors,
        )

        # Candidate identity
        if state.linkedin_data:
            li = state.linkedin_data
            report.candidate_name = li.name
            report.candidate_headline = li.headline
            report.candidate_location = li.location
            report.candidate_current_role = li.current_role

        # Scores
        if state.fit_score_data:
            fs = state.fit_score_data
            report.hire_score = fs.hire_score
            report.hire_verdict = fs.hire_verdict
            report.score_breakdown = fs.breakdown
            report.culture_fit_score = fs.culture_fit_score
            report.culture_fit_reasoning = fs.culture_fit_reasoning
            report.suggested_role = fs.role_fit
            report.role_fit = fs.role_fit
            report.best_fit_archetype = fs.best_fit_archetype
            report.matched_skills = fs.breakdown.matched_skills
            report.missing_skills = fs.breakdown.missing_skills
            report.extra_skills = fs.breakdown.extra_skills

        # GitHub stats
        if state.github_data:
            gh = state.github_data
            report.github_stars = gh.total_stars
            report.github_repos = gh.public_repos
            report.recent_commits_90d = gh.recent_commit_count_90d
            report.top_languages = gh.top_languages
            report.language_breakdown = gh.language_breakdown

        # Community
        if state.web_research_data:
            web = state.web_research_data
            report.hackathons = web.hackathons
            report.community_signals = web.community_signals

        # Synthesis
        if state.synthesis_data:
            syn = state.synthesis_data
            report.executive_summary = syn.executive_summary
            report.green_flags = syn.green_flags
            report.red_flags = syn.red_flags
            report.interview_questions = syn.interview_questions
            report.detailed_analysis = syn.detailed_analysis

        return report