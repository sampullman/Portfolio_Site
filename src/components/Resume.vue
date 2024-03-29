<template>
  <div id="content">
    <div id="resume_title">Resume</div>
    <div id="resume_pdf_link">
      <a href="/static/resume.pdf">(PDF Version)</a>
    </div>
    <div class="resume_left">
      <div class="resume_header">Education</div>
      <div class="resume_section_text section">
        B.S. in Electrical Engineering and Computer Science<br />
        University of California, Berkeley, May 2012
      </div>
      <div class="resume_header">Qualifications</div>
      <div class="resume_section_text section">
        <ul class="resume_list">
          <li>
            Experienced programmer in Java, Python, C, C++, Visual Basic, Javascript,
            JQuery, PHP, Lisp (Scheme), and MIPS
          </li>
          <li>
            Experience developing Android, Django, Symfony, and Ruby on Rails applications
          </li>
          <li>Knowledge of Unix, Linux (Debian), Windows, and Macintosh systems</li>
          <li>
            Able to collaborate well on projects through version control systems such as
            Git and Subversion
          </li>
        </ul>
      </div>
      <div class="resume_header">Relevant Coursework</div>
      <div id="course_work" :ref="courses" class="resume_section_text section">
        <div class="course">
          <span
            ><span class="course_symbol">+</span>Operating Systems and Systems
            Programming</span
          >
          <div id="162" class="course_text">
            <span class="resume_text_subtitle">CS 162</span>
            <ul class="resume_list">
              <li>
                Introduction and applications to processes, interprocess communication,
                and synchronization.
              </li>
              <li>
                Techniques for resource allocation, scheduling, performance evaluation,
                along with file systems, memory allocation, and security.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span
            ><span class="course_symbol">+</span>Programming Languages and Compilers</span
          >
          <div id="164" class="course_text">
            <span class="resume_text_subtitle">CS 164</span>
            <ul class="resume_list">
              <li>The design of modern programming languages.</li>
              <li>
                Principles and techniques of scanning, parsing, semantic analysis, and
                code generation. Implementation of compilers, interpreters, and
                assemblers. Overview of run-time organization and error handling.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span
            ><span class="course_symbol">+</span>Efficient Algorithms and Intractable
            Problems</span
          >
          <div id="170" class="course_text">
            <span class="resume_text_subtitle">CS 170</span>
            <ul class="resume_list">
              <li>
                Concept and basic techniques in the design and analysis of algorithms;
                models of computation; lower bounds.
              </li>
              <li>
                Turing machines, how to count steps, deterministic and nondeterministic
                Turing machines, NP-completeness.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span
            ><span class="course_symbol">+</span>Introduction to Database Systems</span
          >
          <div id="186" class="course_text">
            <span class="resume_text_subtitle">CS 186</span>
            <ul class="resume_list">
              <li>Hierarchical, network, relational, and object-oriented data models.</li>
              <li>
                High-level interfaces including application generators, browsers, and
                report writers.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span
            ><span class="course_symbol">+</span>Introduction to Artificial
            Intelligence</span
          >
          <div id="188" class="course_text">
            <span class="resume_text_subtitle">CS 188</span>
            <ul class="resume_list">
              <li>
                Basic ideas and techniques underlying the design of intelligent computer
                systems
              </li>
              <li>
                Class projects based in python language, extensive knowledge gained of the
                language through consistent use.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span><span class="course_symbol">+</span>Computer Graphics</span>
          <div id="184" class="course_text">
            <span class="resume_text_subtitle">CS 184</span>
            <ul class="resume_list">
              <li>
                Techniques of modeling objects for the purpose of computer rendering:
                boundary representations, constructive solids geometry, hierarchical scene
                descriptions.
              </li>
              <li>
                Algorithms for clipping, hidden surface removal, and anti-aliasing, along
                with scan-line and ray-based rendering algorithms.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span><span class="course_symbol">+</span>Computer Security</span>
          <div id="161" class="course_text">
            <span class="resume_text_subtitle">CS 161</span>
            <ul class="resume_list">
              <li>
                Cryptography, including encryption, authentication, hash functions,
                cryptographic protocols, and applications.
              </li>
              <li>
                Operating system security, access control, with case studies from
                real-world systems.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span
            ><span class="course_symbol">+</span>Introduction to Communication
            Networks</span
          >
          <div id="122" class="course_text">
            <span class="resume_text_subtitle">EE 122</span>
            <ul class="resume_list">
              <li>
                Introduction to the design and implementation of computer networks,
                focusing on the concepts and fundamental design principles that have
                contributed to the Internet's scalability and robustness.
              </li>
              <li>
                Topics include layering, congestion/flow/error control, routing,
                addressing, multicast, packet scheduling, switching, internetworking,
                network security, and networking/programming interfaces.
              </li>
            </ul>
          </div>
        </div>
        <div class="course">
          <span><span class="course_symbol">+</span>Signals and Systems</span>
          <div id="120" class="course_text">
            <span class="resume_text_subtitle">EE 120</span>
            <ul class="resume_list">
              <li>
                Continuous and discrete-time transform analysis techniques. Fourier
                series, Fourier transform, Laplace and Z-transforms, Sampling and
                reconstruction.
              </li>
              <li>Solution of differential and difference equations using transforms.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="resume_right">
      <div class="resume_header">Experience</div>
      <div class="resume_section_text section">
        <div class="resume_text_title">Independent Android Developer</div>
        <span class="resume_text_subtitle">(2010 - 2012)</span>
        <ul class="resume_list">
          <li>Developed 6 applications covering a variety of styles.</li>
          <li>Tens of thousands of downloads.</li>
          <li>
            App list:
            <a href="https://play.google.com/store/search?q=3dbj&c=apps"
              >https://play.google.com/store/search?q=3dbj&c=apps</a
            >
          </li>
        </ul>
        <div class="resume_text_title">Undergraduate Student Instructor (UGSI)</div>
        <span class="resume_text_subtitle"
          >UC Berkeley, CS61A (Jan. 2012 - May 2012)</span
        >
        <ul class="resume_list">
          <li>
            Worked for one semester as a UGSI in an introductory computer science course
            at UC Berkeley.
          </li>
          <li>
            Taught three hours of discussion section and three hours of lab per week.
          </li>
          <li>
            Assisted with writing labs, discussion notes, and exam questions; grading;
            held office hour sessions twice a week.
          </li>
        </ul>
        <div class="resume_text_title">Programmer and Web Developer</div>
        <span class="resume_text_subtitle"
          >Lawrence Berkeley National Lab (June 2010 to Jan. 2011)</span
        >
        <ul class="resume_list">
          <li>
            Assisted in the development of a web based interface for a self teaching
            expert system (SeTES).
          </li>
          <li>
            Project that will significantly improve the effectiveness and efficiency of
            analyzing, predicting, and designing natural gas production from extremely
            tight unconventional gas reservoirs.
          </li>
        </ul>
        <div class="resume_text_title">
          SULI (Science Undergraduate Laboratory Internships)
        </div>
        <span class="resume_text_subtitle">Summer 2009</span>
        <ul class="resume_list">
          <li>U.S. Department of Energy Berkeley, CA 2009</li>
          <li>
            Worked with LBNL researcher Dr. Jinsong Chen writing code to statistically
            analyze inverted geological data and developed a web based interface for Dr.
            Chen's stochastic inversion codes
          </li>
          <li>
            Abstract:
            <a href="http://adsabs.harvard.edu/abs/2009AGUFMNS31B1168C"
              >adsabs.harvard.edu/abs/2009AGUFMNS31B1168C</a
            >
          </li>
        </ul>
      </div>
      <div class="resume_header">Other Experience</div>
      <div class="resume_section_text section">
        <ul class="resume_list">
          <li>Lab Assistant - Computer Science 3L (Spring 2009)</li>
          <li>Lab Assistant - Computer Science 61BL (Summer 2010)</li>
          <li>Treasurer for the California chapter of Delta Upsilon (2010)</li>
          <li>Webmaster for Delta Upsilon (Fall 2009)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss">
@import '/src/assets/css/colors.postcss';

#content {
  color: #ddd;
}

#resume_title {
  text-align: center;
  font-weight: bold;
  font-size: 35px;
}

#resume_pdf_link {
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
}

.resume_header {
  padding-left: 55px;
  font-weight: bold;
  font-size: 20px;
}

.resume_section_text {
  font-family: 'Arial', sans-serif;
  line-height: 140%;
  font-size: 14px;
  margin-bottom: 18px;
}

.resume_left,
.resume_right {
  margin-bottom: 48px;
  position: relative;
  float: left;
}

.resume_left {
  width: 40%;
  left: 3%;
}

.resume_right {
  left: 6%;
  width: 51%;
}

.resume_text_title {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: bold;
  &:not(:first-child) {
    margin-top: 12px;
  }
}

.resume_text_subtitle {
  padding-left: 14px;
  font-size: 15px;
  font-weight: bold;
  color: #444;
  text-shadow: 0 1px 0 #e5e5ee;
}

.course {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  cursor: pointer;
  line-height: 1.8;
}

.course_text {
  display: none;
  margin-bottom: 12px;
}

.course_symbol {
  width: 13px;
  float: left;
}

.resume_list {
  margin: 4px 0 4px 30px;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5em;
}

.right_aligned {
  position: relative;
  float: right;
}
</style>
