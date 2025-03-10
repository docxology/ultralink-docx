#!/usr/bin/env python
from manim import *

class UltraLinkGraph(Scene):
    def construct(self):
        # Theme setup
        config.background_color = "BLACK"
        
        # Title
        title = Text("USAHistory Knowledge Graph", color="WHITE")
        subtitle = Text("System Visualization", font_size=36, color="WHITE")
        title_group = VGroup(title, subtitle).arrange(DOWN)
        
        self.play(
            Write(title),
            FadeIn(subtitle, shift=DOWN)
        )
        self.wait(1)
        
        # Move title to top
        self.play(
            title_group.animate.scale(0.6).to_edge(UP)
        )
        
        # Create legend
        legend_items = VGroup()
        legend_title = Text("Entity Types", font_size=24, color="WHITE")
        legend_items.add(legend_title)

        # Position legend
        legend_items.arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        legend_items.to_edge(LEFT)
        self.play(Write(legend_items))
        
        # Create entity groups
        entity_groups = VGroup()
        
        # Add entities based on type
        entities = {}
        for entity in [{"id":"event1","type":"Event","name":"American Revolution","attributes":{"year":1776}},{"id":"event2","type":"Event","name":"Civil War","attributes":{"year":1861}},{"id":"event3","type":"Event","name":"World War II","attributes":{"year":1941}}]: 
            color = BLUE
            if entity["type"] == "Event":
                color = YELLOW
            elif entity["type"] == "System":
                color = RED
            elif entity["type"] == "Component":
                color = GREEN
            elif entity["type"] == "Space":
                color = PURPLE
                
            dot = Dot(color=color)
            label = Text(entity["name"], font_size=20).next_to(dot, RIGHT)
            entity_group = VGroup(dot, label)
            entities[entity["id"]] = entity_group
            entity_groups.add(entity_group)
        
        # Position all entity groups
        if len(entity_groups) > 0:
            entity_groups.arrange(RIGHT, buff=2)
            entity_groups.move_to(ORIGIN)
            
            # Animate entities appearance
            for entity_group in entity_groups:
                self.play(
                    *[Create(mob) for mob in entity_group],
                    run_time=0.5
                )

        # Add relationships
        relationships = VGroup()
        for rel in [{"id":"rel1","source":"event1","target":"event2","type":"PRECEDES"},{"id":"rel2","source":"event2","target":"event3","type":"PRECEDES"}]: 
            if rel["source"] in entities and rel["target"] in entities:
                start = entities[rel["source"]].get_center()
                end = entities[rel["target"]].get_center()
                arrow = Arrow(start, end, color="WHITE")
                label = Text(rel["type"], font_size=16).next_to(arrow, UP)
                relationships.add(VGroup(arrow, label))

        # Animate relationships
        if len(relationships) > 0:
            for relationship in relationships:
                self.play(
                    Create(relationship[0]),  # Arrow
                    Write(relationship[1]),   # Label
                    run_time=0.3
                )

        # System-specific animations
        if "USAHistory" == "USAHistory":
            # Timeline-based animation
            timeline = NumberLine(
                x_range=[1700, 2024, 50],
                length=10,
                include_numbers=True,
                label_direction=UP,
                color="WHITE"
            ).to_edge(DOWN)
            self.play(Create(timeline))
            
            # Add year markers for events
            event_years = VGroup()
            for entity in [{"id":"event1","type":"Event","name":"American Revolution","attributes":{"year":1776}},{"id":"event2","type":"Event","name":"Civil War","attributes":{"year":1861}},{"id":"event3","type":"Event","name":"World War II","attributes":{"year":1941}}]: 
                if entity.get("attributes", {}).get("year"):
                    year_dot = Dot(point=timeline.n2p(entity["attributes"]["year"]), color=YELLOW)
                    year_label = Text(str(entity["attributes"]["year"]), font_size=16).next_to(year_dot, UP)
                    event_years.add(VGroup(year_dot, year_label))
            if len(event_years) > 0:
                self.play(Create(event_years))
            
        elif "USAHistory" == "POMDP":
            # State transition diagram
            belief_update = VGroup()
            
            # Create state transition cycle
            state_cycle = Circle(radius=2, color=BLUE)
            state_label = Text("State Transition", font_size=20).move_to(state_cycle)
            
            # Create observation emission
            obs_arrow = Arrow(state_cycle.get_top(), UP * 2, color=GREEN)
            obs_label = Text("Observation", font_size=20).next_to(obs_arrow, RIGHT)
            
            # Create action influence
            action_arrow = Arrow(DOWN * 2, state_cycle.get_bottom(), color=RED)
            action_label = Text("Action", font_size=20).next_to(action_arrow, LEFT)
            
            belief_update.add(state_cycle, state_label, obs_arrow, obs_label, action_arrow, action_label)
            
            self.play(
                Create(state_cycle),
                Write(state_label),
                Create(obs_arrow),
                Write(obs_label),
                Create(action_arrow),
                Write(action_label)
            )
            
        elif "USAHistory" == "Car":
            # Component hierarchy animation
            hierarchy = VGroup()
            
            # Create system levels
            levels = ["System", "Subsystem", "Component"]
            level_boxes = []
            
            for i, level in enumerate(levels):
                box = Rectangle(height=1, width=3, color=BLUE)
                text = Text(level, font_size=20)
                group = VGroup(box, text)
                group.shift(DOWN * (i * 1.5))
                hierarchy.add(group)
                level_boxes.append(box)
            
            # Add connecting lines
            for i in range(len(level_boxes) - 1):
                line = Line(
                    level_boxes[i].get_bottom(),
                    level_boxes[i + 1].get_top(),
                    color="WHITE"
                )
                hierarchy.add(line)
            
            self.play(Create(hierarchy))
            
        # Final layout adjustments
        if len(entity_groups) > 0 or len(relationships) > 0:
            self.play(
                *[group.animate.scale(0.8) for group in [*entity_groups, relationships] if len(group) > 0]
            )
        
        # Conclusion
        if True:
            conclusion_text = Text(
                f"USAHistory Knowledge Graph Visualization",
                color="WHITE"
            )
            self.play(
                *[FadeOut(mob) for mob in self.mobjects if mob != title_group],
                run_time=1
            )
            self.play(Write(conclusion_text))
            self.wait(1)
            self.play(
                FadeOut(conclusion_text),
                FadeOut(title_group)
            )
        else:
            self.wait(2)
            self.play(
                *[FadeOut(mob) for mob in self.mobjects]
            )
