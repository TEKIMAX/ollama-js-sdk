import chalk from 'chalk';
import { createInterface } from 'readline';
import * as figlet from 'figlet';
import gradientString from 'gradient-string';
import { AI_CURRICULUM, Chapter, Lesson, getLessonById, searchLessons, QuizQuestion } from './lessons';

export class InteractiveMenu {
  private rl: any;
  private currentChapter: Chapter | null = null;
  private currentLesson: Lesson | null = null;

  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  private async prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer: string) => {
        resolve(answer.trim());
      });
    });
  }

  private clearScreen() {
    console.clear();
  }

  private displayHeader() {
    const title = figlet.textSync('AI ACADEMY', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default'
    });
    
    const gradient = gradientString('#00ff88', '#0088ff', '#8800ff');
    console.log(gradient(title));
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow('      🎓 Learn AI & LLM Concepts Interactively 🎓'));
    console.log(chalk.cyan('═'.repeat(60)));
    console.log();
  }

  private displayChapterMenu() {
    console.log(chalk.bold.white('\n📚 CHAPTERS:\n'));
    
    AI_CURRICULUM.forEach((chapter, index) => {
      console.log(chalk.cyan(`  ${index + 1}. ${chapter.title}`));
      console.log(chalk.gray(`     ${chapter.description}\n`));
    });
    
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow('  S. 🔍 Search for a topic'));
    console.log(chalk.yellow('  Q. 📊 Quick Reference'));
    console.log(chalk.yellow('  X. 🚪 Exit'));
    console.log(chalk.cyan('═'.repeat(60)));
  }

  private displayLessonMenu(chapter: Chapter) {
    console.log(chalk.bold.white(`\n📖 ${chapter.title}\n`));
    
    chapter.lessons.forEach((lesson, index) => {
      console.log(chalk.green(`  ${index + 1}. ${lesson.title}`));
      console.log(chalk.gray(`     ${lesson.description}\n`));
    });
    
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow('  B. ⬅️  Back to chapters'));
    console.log(chalk.cyan('═'.repeat(60)));
  }

  private displayLesson(lesson: Lesson) {
    console.log(chalk.bold.cyan(`\n📝 ${lesson.title}\n`));
    console.log(chalk.cyan('─'.repeat(60)));
    
    // Format and display content
    const lines = lesson.content.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s*/, '');
        if (level === 1) {
          console.log(chalk.bold.yellow(`\n${text}`));
        } else if (level === 2) {
          console.log(chalk.bold.green(`\n${text}`));
        } else {
          console.log(chalk.bold.white(`\n${text}`));
        }
      } else if (line.startsWith('•')) {
        console.log(chalk.cyan(line));
      } else if (line.startsWith('✓')) {
        console.log(chalk.green(line));
      } else if (line.startsWith('⚠️')) {
        console.log(chalk.yellow(line));
      } else if (line.includes('**')) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, text) => chalk.bold(text));
        console.log(formatted);
      } else if (line.trim()) {
        console.log(line);
      }
    }
    
    // Display examples if available
    if (lesson.examples && lesson.examples.length > 0) {
      console.log(chalk.bold.magenta('\n📌 Examples:'));
      lesson.examples.forEach(example => {
        console.log(chalk.gray('  ' + example));
      });
    }
    
    console.log(chalk.cyan('\n' + '═'.repeat(60)));
    
    // Options
    if (lesson.quiz && lesson.quiz.length > 0) {
      console.log(chalk.yellow('  Q. 🎯 Take Quiz'));
    }
    console.log(chalk.yellow('  B. ⬅️  Back to lessons'));
    console.log(chalk.yellow('  M. 🏠 Main menu'));
    console.log(chalk.cyan('═'.repeat(60)));
  }

  private async runQuiz(questions: QuizQuestion[]) {
    console.log(chalk.bold.magenta('\n🎯 QUIZ TIME!\n'));
    let score = 0;
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(chalk.bold.white(`\nQuestion ${i + 1}/${questions.length}:`));
      console.log(chalk.cyan(q.question + '\n'));
      
      q.options.forEach((option, index) => {
        console.log(chalk.gray(`  ${index + 1}. ${option}`));
      });
      
      const answer = await this.prompt(chalk.yellow('\nYour answer (1-' + q.options.length + '): '));
      const userAnswer = parseInt(answer) - 1;
      
      if (userAnswer === q.correctAnswer) {
        console.log(chalk.green('✅ Correct!'));
        score++;
      } else {
        console.log(chalk.red('❌ Incorrect.'));
        console.log(chalk.yellow(`Correct answer: ${q.options[q.correctAnswer]}`));
      }
      console.log(chalk.gray(`Explanation: ${q.explanation}`));
    }
    
    console.log(chalk.bold.cyan(`\n📊 Final Score: ${score}/${questions.length}`));
    
    if (score === questions.length) {
      console.log(chalk.green('🌟 Perfect score! Excellent work!'));
    } else if (score >= questions.length * 0.7) {
      console.log(chalk.yellow('👍 Good job! Keep learning!'));
    } else {
      console.log(chalk.gray('📚 Review the material and try again!'));
    }
    
    await this.prompt(chalk.gray('\nPress Enter to continue...'));
  }

  private async searchTopics() {
    console.log(chalk.bold.magenta('\n🔍 SEARCH TOPICS\n'));
    const query = await this.prompt(chalk.yellow('Enter search term: '));
    
    if (!query) return;
    
    const results = searchLessons(query);
    
    if (results.length === 0) {
      console.log(chalk.red('\nNo results found.'));
    } else {
      console.log(chalk.green(`\nFound ${results.length} result(s):\n`));
      results.forEach((lesson, index) => {
        console.log(chalk.cyan(`${index + 1}. ${lesson.title}`));
        console.log(chalk.gray(`   ${lesson.description}\n`));
      });
      
      const choice = await this.prompt(chalk.yellow('Select a lesson (number) or B to go back: '));
      
      if (choice.toLowerCase() !== 'b') {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < results.length) {
          this.clearScreen();
          this.displayHeader();
          this.displayLesson(results[index]);
          await this.handleLessonMenu(results[index]);
        }
      }
    }
  }

  private displayQuickReference() {
    console.log(chalk.bold.magenta('\n📊 QUICK REFERENCE\n'));
    
    const references = [
      { title: 'Model Comparison', content: `
${chalk.bold.cyan('GPT-OSS 20 vs GPT-OSS 120')}
${chalk.gray('─'.repeat(40))}
${chalk.green('GPT-OSS 20:')}
  • Parameters: 20B
  • Context: 8,192 tokens
  • Speed: Fast
  • Use: General tasks

${chalk.green('GPT-OSS 120:')}
  • Parameters: 120B
  • Context: 32,768 tokens
  • Speed: Slower
  • Use: Complex tasks
      `},
      { title: 'Common Parameters', content: `
${chalk.bold.cyan('Generation Parameters')}
${chalk.gray('─'.repeat(40))}
${chalk.yellow('Temperature:')} 0.0-2.0 (creativity)
${chalk.yellow('Top-P:')} 0.0-1.0 (diversity)
${chalk.yellow('Top-K:')} 1-100 (vocabulary limit)
${chalk.yellow('Max Tokens:')} Output length limit
${chalk.yellow('Stop Sequences:')} End generation triggers
      `},
      { title: 'Token Estimates', content: `
${chalk.bold.cyan('Token Conversions')}
${chalk.gray('─'.repeat(40))}
1 token ≈ 4 characters
1 token ≈ 0.75 words
100 tokens ≈ 75 words
1,000 tokens ≈ 750 words
1,000 tokens ≈ 1.5 pages
      `}
    ];
    
    references.forEach(ref => {
      console.log(ref.content);
    });
    
    console.log(chalk.cyan('═'.repeat(60)));
  }

  private async handleLessonMenu(lesson: Lesson) {
    const choice = await this.prompt(chalk.yellow('\nSelect option: '));
    
    switch (choice.toLowerCase()) {
      case 'q':
        if (lesson.quiz && lesson.quiz.length > 0) {
          await this.runQuiz(lesson.quiz);
        }
        break;
      case 'b':
        return 'back';
      case 'm':
        return 'main';
      default:
        return 'back';
    }
  }

  public async start() {
    this.clearScreen();
    this.displayHeader();
    
    while (true) {
      if (this.currentChapter) {
        this.displayLessonMenu(this.currentChapter);
        const choice = await this.prompt(chalk.yellow('\nSelect lesson: '));
        
        if (choice.toLowerCase() === 'b') {
          this.currentChapter = null;
          this.clearScreen();
          this.displayHeader();
        } else {
          const lessonIndex = parseInt(choice) - 1;
          if (lessonIndex >= 0 && lessonIndex < this.currentChapter.lessons.length) {
            const lesson = this.currentChapter.lessons[lessonIndex];
            this.clearScreen();
            this.displayHeader();
            this.displayLesson(lesson);
            const result = await this.handleLessonMenu(lesson);
            
            if (result === 'main') {
              this.currentChapter = null;
            }
            this.clearScreen();
            this.displayHeader();
          }
        }
      } else {
        this.displayChapterMenu();
        const choice = await this.prompt(chalk.yellow('\nSelect option: '));
        
        if (choice.toLowerCase() === 'x') {
          console.log(chalk.green('\n👋 Thank you for learning with AI Academy!\n'));
          this.rl.close();
          break;
        } else if (choice.toLowerCase() === 's') {
          await this.searchTopics();
          this.clearScreen();
          this.displayHeader();
        } else if (choice.toLowerCase() === 'q') {
          this.displayQuickReference();
          await this.prompt(chalk.gray('\nPress Enter to continue...'));
          this.clearScreen();
          this.displayHeader();
        } else {
          const chapterIndex = parseInt(choice) - 1;
          if (chapterIndex >= 0 && chapterIndex < AI_CURRICULUM.length) {
            this.currentChapter = AI_CURRICULUM[chapterIndex];
            this.clearScreen();
            this.displayHeader();
          }
        }
      }
    }
  }
}