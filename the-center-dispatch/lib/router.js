/** Conservative, explicit routing. No presumed model superiority or fake source access. */
export function chooseRoute(message, preference = 'auto') {
  const input = String(message || '').toLowerCase();
  if (preference === 'quick') return {kind:'single',reason:'You requested a quick response.'};
  if (preference === 'independent' || /\b(compare (two|both|approaches)|independent (review|opinions?|approaches?)|second opinion|challenge (this|the plan))\b/.test(input)) return {kind:'independent',reason:'Two independent perspectives can reveal different blind spots.'};
  const substantial = /\b(build|design|develop|create|prepare|launch|improve|restructure|evaluate|plan)\b/.test(input);
  const composite = /\b(combine|multiple outputs?|complete package|end.to.end|research.*(?:and|then).*build|both .* and |one .* and another|together|website.*(?:and|plus).*outreach)\b/.test(input);
  const quality = preference === 'best' || /\b(best (possible|result|version|outcome)|not in a rush|thorough|deep (analysis|research)|high quality)\b/.test(input);
  if ((substantial && composite) || (substantial && quality && input.length > 180)) return {kind:'complementary',reason:'Distinct deliverables can be created separately and integrated.'};
  return {kind:'single',reason:'One capable engine is proportionate to this request.'};
}
export function workerInstructions(kind,message) {
  const shared = 'USER REQUEST:\n'+message+'\nDo not invent access to external records, live research, tool use, approvals, or completed actions. Label unverified assumptions.';
  if(kind==='independent'){const p='Solve the WHOLE problem independently, without seeing the other engine. Identify important uncertainty.\n'+shared;return [p,p];}
  if(kind==='complementary')return [
    'You own the EVIDENCE, REQUIREMENTS and FEASIBILITY deliverable. Extract facts supplied by the user, define success criteria and flag evidence gaps; do not claim live retrieval.\n'+shared,
    'You own the CREATIVE, USER-FACING and IMPLEMENTATION deliverable. Provide practical usable assets, not another long research report. Clearly mark what still requires verification.\n'+shared
  ];
  return ['Provide the best direct answer, with appropriate depth and truthfulness.\n'+shared];
}
export function synthesisInstructions(kind,message,a,b) {
 const goal=kind==='independent'?'Compare two independent SOLUTIONS; do not treat agreement as evidence.':'MERGE two complementary deliverables into ONE coherent result, preserve non-overlapping content and flag contradictions rather than averaging them.';
 return 'You are the integrator. '+goal+' Do not claim source checks, testing or external actions unless explicitly demonstrated.\nUSER:\n'+message+'\nENGINE A:\n'+a+'\nENGINE B:\n'+b;
}
