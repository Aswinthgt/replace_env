# Replace Env in File

**Replace Env in File** is an Azure DevOps custom task that replaces placeholders in a file with values from pipeline variables or environment variables.  
It’s perfect for injecting build-time or deployment-time configuration into your YAML, JSON, or any text-based files.

---

## 🛠 How It Works
You can define variables in your Azure Pipeline and reference them inside your files with a chosen delimiter (default is `__`).

---

## 📂 Example Input File (deployment.yaml)
```yaml
apiVersion: v1
kind: Deployment
metadata:
  name: my-app
spec:
  containers:
    - image: myrepo/__IMAGE_TAG__
      env:
        - name: API_KEY
          value: "__API_KEY__"
```

## 📦 Pipeline Variables
```yaml
IMAGE_TAG = 1.0.0
API_KEY = 123456789
```

## 📜 After running the task, your file becomes:
```yaml
apiVersion: v1
kind: Deployment
metadata:
  name: my-app
spec:
  containers:
    - image: myrepo/1.0.0
      env:
        - name: API_KEY
          value: "123456789"
```

## 📋 Example Pipeline
```yaml
variables:
  IMAGE_TAG: 1.0.0
  API_KEY: 123456789

steps:
  - task: replace-env@1
    inputs:
      filePath: $(Build.SourcesDirectory)/deployment.yaml
      placeholderDelimiter: __
```
