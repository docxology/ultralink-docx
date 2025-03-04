/**
 * Sample document fixtures for testing
 * 
 * This module provides a set of standardized document samples
 * for use in tests across the UltraLink testing suite.
 */

/**
 * Basic document with Obsidian-style links
 */
const basicDocument = `
# Sample Document

This is a sample document that contains links to various entities.

## People

- [[Alan Turing]] was a mathematician and computer scientist.
- [[John von Neumann]] contributed to many fields including mathematics and computer science.

## Concepts

- [[Computer Science]] is the study of computation and information.
- [[Artificial Intelligence]] is a branch of computer science.
- [[Turing Test]] was proposed by [[Alan Turing]].

## Places

- [[Cambridge]] is where Turing studied.
- [[Princeton]] is where von Neumann worked.
`;

/**
 * Document with mixed link formats (Obsidian and @mentions)
 */
const mixedFormatDocument = `
# Mixed Format Document

This document demonstrates different link formats:

- Standard wiki links: [[Alan Turing]] and [[Computer Science]]
- Mention format: @JohnVonNeumann and @ArtificialIntelligence
- Tags: #mathematics #computerscience
`;

/**
 * Document with many links for performance testing
 */
const generateLargeDocument = (linkCount = 100) => {
  let content = `# Large Document\n\nThis document contains ${linkCount} links for performance testing.\n\n`;
  
  for (let i = 1; i <= linkCount; i++) {
    content += `- Item ${i}: [[Entity ${i}]]\n`;
    
    // Add some cross-references occasionally
    if (i % 10 === 0) {
      content += `  - Related to [[Entity ${i - 5}]] and [[Entity ${i + 5 > linkCount ? 1 : i + 5}]]\n`;
    }
  }
  
  return content;
};

/**
 * Document with malformed links for error handling testing
 */
const malformedDocument = `
# Malformed Document

This document contains various malformed links:

- Unclosed link: [[Unclosed
- Empty link: [[]]
- Nested links: [[Outer [[Inner]] Link]]
- Duplicate brackets: [[Extra]]]]
- Missing brackets: Link without brackets
`;

/**
 * Academic paper format with citations
 */
const academicDocument = `
# The Foundations of Artificial Intelligence

## Abstract

This paper explores the foundational concepts of [[Artificial Intelligence]].

## Introduction

The field of [[Artificial Intelligence]] (AI) was established at the [[Dartmouth Conference]] in 1956.
Key figures such as [[John McCarthy]] and [[Marvin Minsky]] were present.

## Methods

We analyze the development of AI through bibliometric analysis of key papers [@McCarthy1955; @Turing1950].

## Results

Our analysis shows connections between [[Machine Learning]], [[Neural Networks]], and [[Symbolic AI]].

## References

1. [@McCarthy1955] [[John McCarthy]], 1955. "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence."
2. [@Turing1950] [[Alan Turing]], 1950. "Computing Machinery and Intelligence."
`;

/**
 * Personal knowledge base format
 */
const personalKnowledgeBase = `
# Work Projects

## Current Projects

- [[Project Alpha]] - Due: 2023-04-15
  - Key contact: [[Jane Smith]]
  - Related: [[Machine Learning]], [[Data Analysis]]
- [[Project Beta]] - Due: 2023-05-30
  - Key contact: [[John Doe]]
  - Related: [[Natural Language Processing]]

## Ideas

- Combine approaches from [[Project Alpha]] and [[Project Beta]]
- Read paper by [[Alan Turing]] on [[Computational Methods]]
- Schedule meeting with [[Jane Smith]] and [[John Doe]]

## Daily Notes

### 2023-03-15

Met with [[Jane Smith]] about [[Project Alpha]]. She suggested reviewing [[Machine Learning]] techniques.
`;

module.exports = {
  basicDocument,
  mixedFormatDocument,
  generateLargeDocument,
  malformedDocument,
  academicDocument,
  personalKnowledgeBase
}; 