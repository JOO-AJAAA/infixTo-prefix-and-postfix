      const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3,
      };

      function isOperator(char) {
        return ["+", "-", "*", "/", "^"].includes(char);
      }

      function isOperand(char) {
        return /[a-zA-Z0-9]/.test(char);
      }

      function validateExpression(expr) {
        const cleanExpr = expr.replace(/\s/g, "");
        let parentheses = 0;
        let lastChar = "";

        if (!cleanExpr) return "Ekspresi tidak boleh kosong";

        for (let char of cleanExpr) {
          if (char === "(") {
            parentheses++;
          } else if (char === ")") {
            parentheses--;
            if (parentheses < 0) {
              return "Tanda kurung tidak seimbang";
            }
          } else if (!isOperand(char) && !isOperator(char)) {
            return `Karakter tidak valid: '${char}'`;
          } else if (isOperator(char) && isOperator(lastChar)) {
            return "Dua operator berturut-turut tidak diizinkan";
          }
          lastChar = char;
        }

        if (parentheses !== 0) {
          return "Tanda kurung tidak seimbang";
        }

        if (
          isOperator(cleanExpr[0]) ||
          isOperator(cleanExpr[cleanExpr.length - 1])
        ) {
          return "Ekspresi tidak boleh dimulai atau diakhiri dengan operator";
        }

        return null;
      }

      function infixToPostfix(infix) {
        const stack = [];
        let postfix = "";
        const steps = [];

        steps.push(`Mulai konversi: "${infix}"`);
        steps.push(`Stack awal: [], Output: ""`);

        for (let i = 0; i < infix.length; i++) {
          const char = infix[i];

          if (char === " ") continue;

          if (isOperand(char)) {
            postfix += char + " ";
            steps.push(
              `Baca operand '${char}' → Tambah ke output: "${postfix.trim()}"`
            );
          } else if (char === "(") {
            stack.push(char);
            steps.push(`Baca '(' → Push ke stack: [${stack.join(", ")}]`);
          } else if (char === ")") {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
              const op = stack.pop();
              postfix += op + " ";
              steps.push(
                `Pop '${op}' dari stack → Output: "${postfix.trim()}", Stack: [${stack.join(
                  ", "
                )}]`
              );
            }
            stack.pop();
            steps.push(`Pop '(' dari stack → Stack: [${stack.join(", ")}]`);
          } else if (isOperator(char)) {
            while (
              stack.length > 0 &&
              precedence[stack[stack.length - 1]] >= precedence[char] &&
              stack[stack.length - 1] !== "("
            ) {
              const op = stack.pop();
              postfix += op + " ";
              steps.push(
                `Pop '${op}' (prioritas ≥ '${char}') → Output: "${postfix.trim()}", Stack: [${stack.join(
                  ", "
                )}]`
              );
            }
            stack.push(char);
            steps.push(
              `Push operator '${char}' ke stack: [${stack.join(", ")}]`
            );
          }
        }

        while (stack.length > 0) {
          const op = stack.pop();
          postfix += op + " ";
          steps.push(
            `Pop '${op}' dari stack → Output: "${postfix.trim()}", Stack: [${stack.join(
              ", "
            )}]`
          );
        }

        steps.push(`Hasil akhir: "${postfix.trim()}"`);
        return { result: postfix.trim(), steps };
      }

      function infixToPrefix(infix) {
        let reversed = "";
        for (let i = infix.length - 1; i >= 0; i--) {
          if (infix[i] === "(") {
            reversed += ")";
          } else if (infix[i] === ")") {
            reversed += "(";
          } else {
            reversed += infix[i];
          }
        }

        const stack = [];
        let postfix = "";
        const steps = [];

        steps.push(`Mulai konversi: "${infix}"`);
        steps.push(`Balik ekspresi: "${reversed}"`);
        steps.push(`Stack awal: [], Output: ""`);

        for (let i = 0; i < reversed.length; i++) {
          const char = reversed[i];

          if (char === " ") continue;

          if (isOperand(char)) {
            postfix += char + " ";
            steps.push(
              `Baca operand '${char}' → Tambah ke output: "${postfix.trim()}"`
            );
          } else if (char === "(") {
            stack.push(char);
            steps.push(`Baca '(' → Push ke stack: [${stack.join(", ")}]`);
          } else if (char === ")") {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
              const op = stack.pop();
              postfix += op + " ";
              steps.push(
                `Pop '${op}' dari stack → Output: "${postfix.trim()}", Stack: [${stack.join(
                  ", "
                )}]`
              );
            }
            stack.pop(); // Remove '('
            steps.push(`Pop '(' dari stack → Stack: [${stack.join(", ")}]`);
          } else if (isOperator(char)) {
            while (
              stack.length > 0 &&
              precedence[stack[stack.length - 1]] > precedence[char] &&
              stack[stack.length - 1] !== "("
            ) {
              const op = stack.pop();
              postfix += op + " ";
              steps.push(
                `Pop '${op}' (prioritas > '${char}') → Output: "${postfix.trim()}", Stack: [${stack.join(
                  ", "
                )}]`
              );
            }
            stack.push(char);
            steps.push(
              `Push operator '${char}' ke stack: [${stack.join(", ")}]`
            );
          }
        }

        while (stack.length > 0) {
          const op = stack.pop();
          postfix += op + " ";
          steps.push(
            `Pop '${op}' dari stack → Output: "${postfix.trim()}", Stack: [${stack.join(
              ", "
            )}]`
          );
        }

        const prefix = postfix.trim().split(" ").reverse().join(" ");
        steps.push(`Balik hasil: "${prefix}"`);
        steps.push(`Hasil akhir: "${prefix}"`);

        return { result: prefix, steps };
      }

      function switchTab(tabName) {
        document
          .querySelectorAll(".nav-tab")
          .forEach((tab) => tab.classList.remove("active"));
        document
          .querySelector(`[onclick="switchTab('${tabName}')"]`)
          .classList.add("active");

        document
          .querySelectorAll(".tab-content")
          .forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-tab`).classList.add("active");
      }

      function convertToPostfix() {
        const input = document.getElementById("postfixInput").value.trim();
        const resultDiv = document.getElementById("postfixResult");
        const stepsDiv = document.getElementById("postfixSteps");
        const stepsContainer = document.getElementById("postfixStepsContainer");
        const errorDiv = document.getElementById("postfixError");

        errorDiv.classList.add("hidden");
        stepsDiv.classList.add("hidden");

        const validationError = validateExpression(input);
        if (validationError) {
          showError("postfixError", validationError);
          return;
        }

        try {
          const result = infixToPostfix(input);
          resultDiv.textContent = result.result;

          stepsContainer.innerHTML = "";
          result.steps.forEach((step, index) => {
            const stepDiv = document.createElement("div");
            stepDiv.className = "step-item";
            stepDiv.innerHTML = `<span class="step-number">${
              index + 1
            }.</span>${step}`;
            stepsContainer.appendChild(stepDiv);
          });

          stepsDiv.classList.remove("hidden");
        } catch (error) {
          showError("postfixError", "Terjadi kesalahan: " + error.message);
        }
      }

      function convertToPrefix() {
        const input = document.getElementById("prefixInput").value.trim();
        const resultDiv = document.getElementById("prefixResult");
        const stepsDiv = document.getElementById("prefixSteps");
        const stepsContainer = document.getElementById("prefixStepsContainer");
        const errorDiv = document.getElementById("prefixError");

        errorDiv.classList.add("hidden");
        stepsDiv.classList.add("hidden");

        const validationError = validateExpression(input);
        if (validationError) {
          showError("prefixError", validationError);
          return;
        }

        try {
          const result = infixToPrefix(input);
          resultDiv.textContent = result.result;

          stepsContainer.innerHTML = "";
          result.steps.forEach((step, index) => {
            const stepDiv = document.createElement("div");
            stepDiv.className = "step-item";
            stepDiv.innerHTML = `<span class="step-number">${
              index + 1
            }.</span>${step}`;
            stepsContainer.appendChild(stepDiv);
          });

          stepsDiv.classList.remove("hidden");
        } catch (error) {
          showError("prefixError", "Terjadi kesalahan: " + error.message);
        }
      }

      function showError(errorId, message) {
        const errorDiv = document.getElementById(errorId);
        errorDiv.textContent = message;
        errorDiv.classList.remove("hidden");
      }

      document
        .getElementById("postfixInput")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") convertToPostfix();
        });

      document
        .getElementById("prefixInput")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") convertToPrefix();
        });

      window.onload = function () {
        convertToPostfix();
      };