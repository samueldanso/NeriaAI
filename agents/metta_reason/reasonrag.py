"""
Reasoning RAG System for MeTTa Knowledge Graph
Query and retrieval capabilities for reasoning-related knowledge
"""

import re
from hyperon import MeTTa, E, S, ValueAtom
from typing import List, Dict, Any, Optional, Tuple


class GeneralRAG:
    """
    RAG system for reasoning-related queries using MeTTa knowledge graph.
    """
    
    def __init__(self, metta_instance: MeTTa):
        """
        Initialize the RAG system with a MeTTa instance.
        
        Args:
            metta_instance: Initialized MeTTa instance with knowledge graph
        """
        self.metta = metta_instance
    
    def query_reasoning_pattern(self, pattern_type: str) -> List[str]:
        """
        Query for reasoning patterns of a specific type.
        
        Args:
            pattern_type: Type of reasoning (deductive, inductive, abductive, etc.)
            
        Returns:
            List of reasoning pattern descriptions
        """
        pattern_type = pattern_type.strip('"')
        query_str = f'!(match &self (reasoning_pattern {pattern_type} $description) $description)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [r[0].get_object().value for r in results if r and len(r) > 0]
        return []
    
    def query_capability(self, concept: str) -> List[str]:
        """
        Find capabilities linked to a concept.
        
        Args:
            concept: Concept name (e.g., "neural_networks", "CNN")
            
        Returns:
            List of capabilities
        """
        concept = concept.strip('"')
        query_str = f'!(match &self (capability {concept} $feature) $feature)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        unique_features = list(set(str(r[0]) for r in results if r and len(r) > 0)) if results else []
        return unique_features
    
    def query_domain_rule(self, domain: str) -> List[str]:
        """
        Query for domain-specific rules.
        
        Args:
            domain: Domain name (e.g., "neural_networks", "gradient_descent")
            
        Returns:
            List of domain rules
        """
        domain = domain.strip('"')
        query_str = f'!(match &self (domain_rule {domain} $rule) $rule)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [r[0].get_object().value for r in results if r and len(r) > 0]
        return []
    
    def query_strategy(self, strategy_type: str) -> List[str]:
        """
        Query for reasoning strategies.
        
        Args:
            strategy_type: Strategy type (forward_chaining, backward_chaining, etc.)
            
        Returns:
            List of strategy descriptions
        """
        strategy_type = strategy_type.strip('"')
        query_str = f'!(match &self (strategy {strategy_type} $description) $description)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [r[0].get_object().value for r in results if r and len(r) > 0]
        return []
    
    def query_template(self, template_type: str) -> Optional[str]:
        """
        Query for reasoning templates.
        
        Args:
            template_type: Template type (why_explanation, how_explanation, comparison)
            
        Returns:
            Template description or None
        """
        template_type = template_type.strip('"')
        query_str = f'!(match &self (template {template_type} $template) $template)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0 and results[0]:
            return results[0][0].get_object().value
        return None
    
    def query_validation_criteria(self) -> List[str]:
        """
        Query for all validation criteria.
        
        Returns:
            List of validation criteria with descriptions
        """
        query_str = '!(match &self (validation_criterion $name $description) (list $name $description))'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        criteria = []
        if results and len(results) > 0:
            for result in results:
                if result and len(result) >= 2:
                    name = str(result[0])
                    desc = result[1].get_object().value if hasattr(result[1], 'get_object') else str(result[1])
                    criteria.append(f"{name}: {desc}")
        
        return criteria
    
    def query_causes(self, cause: str) -> List[str]:
        """
        Query for causal relationships starting from a cause.
        
        Args:
            cause: The cause to query
            
        Returns:
            List of effects
        """
        cause = cause.strip('"')
        query_str = f'!(match &self (causes {cause} $effect) $effect)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [str(r[0]) for r in results if r and len(r) > 0]
        return []
    
    def query_implies(self, premise: str) -> List[str]:
        """
        Query for logical implications.
        
        Args:
            premise: The premise
            
        Returns:
            List of conclusions
        """
        premise = premise.strip('"')
        query_str = f'!(match &self (implies {premise} $conclusion) $conclusion)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [str(r[0]) for r in results if r and len(r) > 0]
        return []
    
    def get_consideration(self, topic: str) -> List[str]:
        """
        Find considerations/limitations for a topic.
        
        Args:
            topic: Topic to query
            
        Returns:
            List of considerations
        """
        topic = topic.strip('"')
        query_str = f'!(match &self (consideration {topic} $consideration) $consideration)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [r[0].get_object().value for r in results if r and len(r) > 0]
        return []
    
    def query_faq(self, question: str) -> Optional[str]:
        """
        Retrieve FAQ answers.
        
        Args:
            question: Question to look up
            
        Returns:
            Answer or None
        """
        query_str = f'!(match &self (faq "{question}" $answer) $answer)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0 and results[0]:
            return results[0][0].get_object().value
        return None
    
    def get_specific_models(self, model: str) -> List[str]:
        """
        Get specific instances of models from the knowledge graph.
        
        Args:
            model: Model category (e.g., "neural_networks")
            
        Returns:
            List of specific model instances
        """
        model = model.strip('"')
        query_str = f'!(match &self (specificInstance {model} $specific_model) $specific_model)'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            return [str(r[0]) for r in results if r and len(r) > 0]
        return []
    
    def query_all_specific_capabilities(self, model: str) -> List[Tuple[str, str]]:
        """
        Query the capabilities of all specific instances of a model.
        
        Args:
            model: Model category (e.g., "neural_networks")
            
        Returns:
            List of (specific_instance, capability) tuples
        """
        model = model.strip('"')
        query_str = f'!(match &self (, (specificInstance {model} $specificInstance) (capability $specificInstance $specificCapability)) ($specificInstance $specificCapability))'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        if results and len(results) > 0:
            capabilities = []
            for result in results:
                if result and len(result) >= 2:
                    instance = str(result[0])
                    capability = str(result[1])
                    capabilities.append((instance, capability))
            return capabilities
        return []
    
    def add_knowledge(self, relation_type: str, subject: str, object_value: Any) -> str:
        """
        Add new knowledge dynamically to the graph.
        
        Args:
            relation_type: Type of relation (e.g., "domain_rule", "capability")
            subject: Subject of the relation
            object_value: Object/value (string or ValueAtom)
            
        Returns:
            Confirmation message
        """
        if isinstance(object_value, str):
            object_value = ValueAtom(object_value)
        
        self.metta.space().add_atom(E(S(relation_type), S(subject), object_value))
        return f"✓ Added {relation_type}: {subject} → {object_value}"
    
    def get_all_patterns(self) -> Dict[str, List[str]]:
        """
        Get all reasoning patterns organized by type.
        
        Returns:
            Dictionary mapping pattern types to descriptions
        """
        query_str = '!(match &self (reasoning_pattern $type $description) (list $type $description))'
        results = self.metta.run(query_str)
        print(f"Query: {query_str}")
        print(f"Results: {results}")
        
        patterns = {}
        if results and len(results) > 0:
            for result in results:
                if result and len(result) >= 2:
                    pattern_type = str(result[0])
                    description = result[1].get_object().value if hasattr(result[1], 'get_object') else str(result[1])
                    
                    if pattern_type not in patterns:
                        patterns[pattern_type] = []
                    patterns[pattern_type].append(description)
        
        return patterns
    
    def search_knowledge(self, keyword: str) -> List[Dict[str, Any]]:
        """
        Search the knowledge graph for any atoms containing the keyword.
        
        Args:
            keyword: Keyword to search for
            
        Returns:
            List of matching knowledge entries
        """
        # Search across different relation types
        relation_types = [
            "reasoning_pattern",
            "domain_rule",
            "strategy",
            "template",
            "validation_criterion",
            "causes",
            "implies",
            "capability",
            "consideration",
            "specificInstance"
        ]
        
        results = []
        for relation in relation_types:
            query_str = f'!(match &self ({relation} $subject $object) (list "{relation}" $subject $object))'
            matches = self.metta.run(query_str)
            
            if matches and len(matches) > 0:
                for match in matches:
                    if match and len(match) >= 3:
                        entry = {
                            "relation": str(match[0]).strip('"'),
                            "subject": str(match[1]),
                            "object": str(match[2])
                        }
                        
                        # Check if keyword is in any field
                        if (keyword.lower() in entry["subject"].lower() or
                            keyword.lower() in entry["object"].lower()):
                            results.append(entry)
        
        return results

